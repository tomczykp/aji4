import {NextFunction, Request, Response} from "express";
import {UserModel} from "../entity/user.entity";
import UserManager from "../managers/user.manager";

export default class UserController {

    static getAll = async (req: Request, res: Response) : Promise<void> => {
        const users : UserModel[] = await UserManager.getAll();
        res.status(200).json(users)
    };

    static getOne = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
        try {
            const user : UserModel = await UserManager.getOne(req.params.id);
            res.status(200).json(user);
        } catch (e) {
            return next(e);
        }
    };

    static newUser = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
        try {
            const user : UserModel = await UserManager.newUser(req.body);
            res.status(200).json(user);
        } catch (e) {
            return next(e);
        }
    };

    static editUser = async (req: Request, res: Response, next : NextFunction): Promise<void>  => {
        try {
            const user : UserModel = await UserManager.editUser(req.params.id, req.body);
            res.status(200).json(user);
        } catch (e) {
            return next(e);
        }
    };

    static deleteUser = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
        try {
            await UserManager.deleteUser(req.params.id);
            res.status(204).json();
        } catch (e) {
            return next(e);
        }
    };
};

