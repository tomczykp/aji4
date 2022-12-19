import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {validate, ValidationError} from "class-validator";
import User from "../entities/user.entity";
import {Config} from "../config/environment";
import {Repository} from "typeorm";
import {dbConn} from "../app-data-source";

export default class AuthController {
    static login = async (req: Request, res: Response) => {
        //Check if username and password are set
        const {username, password} = req.body;
        if (!(username && password)) {
            res.status(400).send();
            return;
        }

        //Get user from database
        const userRepository : Repository<User> = dbConn.getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {username: username}});
        } catch (error) {
            res.status(401).send();
            return;
        }

        //Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send();
            return;
        }

        //Sing JWT, valid for 1 hour
        const token : string = jwt.sign(
            {userId: user.id, username: user.username},
            Config.jwtSecret,
            {expiresIn: "1h"}
        );

        //Send the jwt in the response
        res.send(token);
    };

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id : string = res.locals.jwtPayload.userId;

        //Get parameters from the body
        const {oldPassword, newPassword} = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
            return;
        }

        //Get user from the database
        const userRepository : Repository<User> = dbConn.getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({
                where: {id: id}
            });
        } catch (id) {
            res.status(401).send();
            return;
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        //Validate the entities (password lenght)
        user.password = newPassword;
        const errors : ValidationError[] = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        //Hash the new password and save
        user.hashPassword();
        await userRepository.save(user);

        res.status(204).send();
    };
}

