import * as bcrypt from "bcryptjs";
import {UserModel} from "../entity/user.entity";
import {EntityNotFoundError, Not, QueryFailedError, Repository} from "typeorm";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";
import UniqNameError from "../errors/username.taken";
import InvalidEntity from "../errors/invalid.entity";
import {UserDTO} from "../dto/user.dto";

export default class UserManager {

    static hashPassword(user : UserModel) : void {
        user.password = bcrypt.hashSync(user.password, 8);
    }

    static checkIfUnencryptedPasswordIsValid(user : UserModel, unencryptedPassword: string) : boolean {
        return bcrypt.compareSync(unencryptedPassword, user.password);
    }

    static getAll = async (rel : boolean = true) : Promise<UserModel[]> => {
        const userRepository: Repository<UserModel> = dbConn.getRepository(UserModel);
        return await userRepository.find({
            select: {"id": true, "username": true, "role": true},
            relations: {orders: rel}
        });

    };

    static getOne = async (uid : string, rel : boolean = true) : Promise<UserModel> => {
        const userRepository : Repository<UserModel> = dbConn.getRepository(UserModel);
        try {
           return await userRepository.findOneOrFail({
                where: {id: uid},
                relations: {orders: rel}
            });
        } catch (error) {
            throw new EntityNotFoundError(UserModel, "id");
        }
    }

    static newUser = async (userDTO : UserDTO) : Promise<UserModel> => {
        let user : UserModel = UserModel.make(userDTO);
        const errors: ValidationError[] = await validate(user);
        if (errors.length > 0)
            throw new InvalidEntity(errors);

        UserManager.hashPassword(user);

        const userRepository : Repository<UserModel> = dbConn.getRepository(UserModel);

        const usernames = await userRepository.find({where: {username: user.username}});
        if (usernames.length > 0)
            throw new UniqNameError();

        try {
            await userRepository.insert(user);
        } catch (e) {
            throw new QueryFailedError("INSERT", [user], e);
        }

        return user;
    };

    static editUser = async (uid : string, userDTO : UserModel) : Promise<UserModel> => {
        let user : UserModel = UserModel.make(userDTO);
        if (userDTO.password == undefined) {
            let oriUser: UserModel = await UserManager.getOne(uid);
            user.password = oriUser.password;
            console.log()
        } else {
            UserManager.hashPassword(user);
        }

        console.log(`"dto: ${user.password}`);
        const errors: ValidationError[] = await validate(user);
        if (errors.length > 0)
            throw new InvalidEntity(errors);

        await UserManager.getOne(uid);
        const userRepository : Repository<UserModel> = dbConn.getRepository(UserModel);

        const usernames = await userRepository.find({
            where: {username: user.username, id: Not(uid)}
        });
        if (usernames.length > 0)
            throw new UniqNameError();

        user.id = uid;
        try {
            user = await userRepository.save(user);
        } catch (e) {
            throw new QueryFailedError("UPDATE", [user], e);
        }
        return user;
    };

    static deleteUser = async (uid : string) => {
        const userRepository : Repository<UserModel> = dbConn.getRepository(UserModel);
        await userRepository.remove(await UserManager.getOne(uid));
    };
}