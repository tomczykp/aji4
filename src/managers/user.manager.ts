import * as bcrypt from "bcryptjs";
import {UserModel} from "../entity/user.entity";
import {EntityNotFoundError, Not, QueryFailedError, Repository} from "typeorm";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";
import UserNameError from "../errors/username.taken";

export default class UserManager {

    static hashPassword(user : UserModel) : void {
        user.password = bcrypt.hashSync(user.password, 8);
    }

    static checkIfUnencryptedPasswordIsValid(user : UserModel, unencryptedPassword: string) : boolean {
        return bcrypt.compareSync(unencryptedPassword, user.password);
    }

    static getAll = async () : Promise<UserModel[]> => {
        const userRepository: Repository<UserModel> = dbConn.getRepository(UserModel);
        return await userRepository.find({
            select: {"id": true, "username": true, "role": true}
        });

    };

    static getOne = async (uid : string) : Promise<UserModel> => {
        const userRepository : Repository<UserModel> = dbConn.getRepository(UserModel);
        try {
           return await userRepository.findOneOrFail({
                select: {"id": true, "username": true, "role": true},
                where: {id: uid}
            });
        } catch (error) {
            throw new EntityNotFoundError(UserModel, "id");
        }
    }

    static newUser = async (userDTO : UserModel) : Promise<UserModel> => {
        const errors: ValidationError[] = await validate(userDTO);
        if (errors.length > 0)
            throw new ValidationError();

        UserManager.hashPassword(userDTO);

        const userRepository : Repository<UserModel> = dbConn.getRepository(UserModel);

        const usernames = await userRepository.find({
            where: {username: userDTO.username}
        });
        if (usernames.length > 0)
            throw new UserNameError();

        try {
            await userRepository.insert(userDTO);
        } catch (e) {
            throw new QueryFailedError("INSERT", [userDTO], e);
        }
        return userDTO;
    };

    static editUser = async (uid : string, userDTO : UserModel) : Promise<UserModel> => {
        const errors: ValidationError[] = await validate(userDTO);
        if (errors.length > 0)
            throw new ValidationError();

        await UserManager.getOne(uid);
        const userRepository : Repository<UserModel> = dbConn.getRepository(UserModel);

        const usernames = await userRepository.find({
            where: {username: userDTO.username, id: Not(uid)}
        });
        if (usernames.length > 0)
            throw new UserNameError();

        userDTO.id = uid;
        try {
            userDTO = await userRepository.save(userDTO);
        } catch (e) {
            throw new QueryFailedError("UPDATE", [userDTO], e);
        }
        return userDTO;
    };

    static deleteUser = async (uid : string) => {
        const userRepository : Repository<UserModel> = dbConn.getRepository(UserModel);
        await userRepository.remove(await UserManager.getOne(uid));
    };
}