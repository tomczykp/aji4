import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {validate, ValidationError} from "class-validator";
import {UserModel} from "../entity/user.entity";
import {Config} from "../config/environment";
import {EntityNotFoundError, Repository} from "typeorm";
import {dbConn} from "../app-data-source";
import UserManager from "../managers/user.manager";

export default class AuthController {

	static login = async (req: Request, res: Response, next : NextFunction) => {
		//Check if username and password are set
		const {username, password} = req.body;
		if (!(username && password)) {
			res.status(400).json({"status": `invalid-parameters: ${username} and ${password}`});
			return;
		}

		//Get user from database
		const userRepository: Repository<UserModel> = dbConn.getRepository(UserModel);
		let user: UserModel;
		try {
			user = await userRepository.findOneOrFail({where: {username: username}});
		} catch (error) {
			return next(new EntityNotFoundError(UserModel, "username"));
		}

		//Check if encrypted password match
		if (!UserManager.checkIfUnencryptedPasswordIsValid(user, password)) {
			res.status(401).send();
			return;
		}

		//Sing JWT, valid for 1 hour
		const token: string = jwt.sign(
			{userId: user.id, username: user.username, role: user.role},
			Config.jwtSecret,
			{expiresIn: "1h"}
		);

		//Send the jwt in the response
		res.status(200).json({
			jwt: token,
			username: user.username,
			role: user.role,
			id: user.id
		});
	};

	static logout = async (req : Request, res: Response) => {
		res.clearCookie('jwt');
		res.status(204).send();
	}
}

