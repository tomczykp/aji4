import * as bcrypt from "bcryptjs";
import {UserModel} from "../entity/user.entity";
import UserController from "../controllers/user.controller";
import {Request, Response} from "express";

export default class UserManager {

    static hashPassword(user : UserModel) : void {
        user.password = bcrypt.hashSync(user.password, 8);
    }

    static checkIfUnencryptedPasswordIsValid(user : UserModel, unencryptedPassword: string) : boolean {
        return bcrypt.compareSync(unencryptedPassword, user.password);
    }

    static listAll = async (req: Request, res : Response) => UserController.listAll(req, res);
    static getOneById = async (req: Request, res : Response) => UserController.getOneById(req, res);
    static newUser = async (req: Request, res : Response) => UserController.newUser(req, res);
    static editUser = async (req: Request, res : Response) => UserController.editUser(req, res);
    static deleteUser = async (req: Request, res : Response) => UserController.deleteUser(req, res);
}