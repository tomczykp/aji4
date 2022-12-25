import {Request, Response} from "express";
import {UserModel} from "../entity/user.entity";
import UserManager from "../managers/user.manager";

export default class UserController {

    static listAll = async (req: Request, res: Response) => {
        const users : UserModel[] = await UserManager.listAll();
        res.status(200).json(users)
    };

    static getOneById = async (req: Request, res: Response) => {
        const user : UserModel = await UserManager.getOneById(req.params.id);
        res.status(200).json(user);
    };

    static newUser = async (req: Request, res: Response) => {
        const user : UserModel = await UserManager.newUser(req.body);
        res.status(200).json(user);
    };

    static editUser = async (req: Request, res: Response) => {
        const user : UserModel = await UserManager.editUser(req.params.id, req.body);
        res.status(200).json(user);
    };

    static deleteUser = async (req: Request, res: Response) => {
        await UserManager.deleteUser(req.params.id);
        res.status(204).json();
    };
};

