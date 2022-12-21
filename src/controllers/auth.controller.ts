import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {validate, ValidationError} from "class-validator";
import {UserModel} from "../entity/user.entity";
import {Config} from "../config/environment";
import {Repository} from "typeorm";
import {dbConn} from "../app-data-source";
import UserManager from "../managers/user.manager";

export default class AuthController {

    static login = async (req: Request, res: Response) => {
        //Check if username and password are set
        const {username, password} = req.body;
        if (!(username && password)) {
            res.status(400).send();
            return;
        }

        //Get user from database
        const userRepository : Repository<UserModel> = dbConn.getRepository(UserModel);
        let user: UserModel;
        try {
            user = await userRepository.findOneOrFail({where: {username: username}});
        } catch (error) {
            res.status(401).send();
            return;
        }

        //Check if encrypted password match
        if (!UserManager.checkIfUnencryptedPasswordIsValid(user, password)) {
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
        const userRepository : Repository<UserModel> = dbConn.getRepository(UserModel);
        let user: UserModel;
        try {
            user = await userRepository.findOneOrFail({
                where: {id: id}
            });
        } catch (id) {
            res.status(401).send();
            return;
        }

        //Check if old password matchs
        if (!UserManager.checkIfUnencryptedPasswordIsValid(user, oldPassword)) {
            res.status(401).send();
            return;
        }

        //Validate the entity (password lenght)
        user.password = newPassword;
        const errors : ValidationError[] = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        //Hash the new password and save
        UserManager.hashPassword(user);
        await userRepository.save(user);

        res.status(204).send();
    };
}

