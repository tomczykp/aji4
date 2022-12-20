import {Request, Response} from "express";
import {Repository} from "typeorm";
import {validate, ValidationError} from "class-validator";

import User from "../entities/user.entity";
import {dbConn} from "../app-data-source";

export default class UserController {

    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        const userRepository : Repository<User> = dbConn.getRepository(User);
        const users: User[] = await userRepository.find({
            select: {"id": true, "username": true, "role": true} //We don't want to send the passwords on response
        });

        //Send the users object
        res.json(users);
    };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const uid: string = req.params.id;

        //Get the user from database
        const userRepository : Repository<User> = dbConn.getRepository(User);
        try {
            const user: User = await userRepository.findOneOrFail({
                select: {"id": true, "username": true, "role": true},
                where: {id: uid}
            });
            res.json(user);
        } catch (error) {
            res.status(404).json("User not found");
        }
    };

    static newUser = async (req: Request, res: Response) => {
        //Get parameters from the body
        let user: User = req.body;

        //Validate if the parameters are ok
        const errors: ValidationError[] = await validate(user);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository : Repository<User> = dbConn.getRepository(User);
        try {
            await userRepository.insert(user);
        } catch (e) {
            res.status(409).json("username already in use");
            return;
        }

        //If all ok, send 201 response
        res.status(201).json("User created");
    };

    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const uid: string = req.params.id;

        //Get values from the body
        const userDTO : User = req.body;

        //Try to find user on database
        const userRepository : Repository<User> = dbConn.getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({
                where: {id: uid}
            });
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).json(`User with id: ${uid} not found`);
            return;
        }

        //Validate the new values on entities
        const errors: ValidationError[] = await validate(userDTO);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        //Try to safe, if fails, that means username already in use
        user = userDTO;
        user.id = uid; // not sure if necessary
        try {
            await userRepository.save(userDTO);
        } catch (e) {
            res.status(409).json("username already in use");
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).json(user);
    };

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const uid: string = req.params.id;

        const userRepository : Repository<User> = dbConn.getRepository(User);
        try {
            await userRepository.findOneOrFail({
                where: {id: uid}
            });
        } catch (error) {
            res.status(404).json("User not found");
            return;
        }
        await userRepository.delete(uid);

        //After all send a 204 (no content, but accepted) response
        res.status(204).json();
    };
};

