import {CategoryModel} from "../entity/category.entity";
import {EntityNotFoundError, Not, QueryFailedError, Repository} from "typeorm";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";
import {plainToClass} from "class-transformer";
import InvalidEntity from "../errors/invalid.entity";
import UniqNameError from "../errors/username.taken";

export default class CategoryManager {

    static getAll = async () : Promise<CategoryModel[]> => {
        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        return await repo.find({relations: {products: true}});
    }

    static getOne = async (cid : string) : Promise<CategoryModel> => {
        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        try {
            return await repo.findOneOrFail({
                where: {id: cid},
                relations: {products: true}
            });
        } catch (e) {
            throw new EntityNotFoundError(CategoryModel, "id");
        }
    }

    static newCategory = async (catDTO : CategoryModel) : Promise<CategoryModel> => {
        const errors: ValidationError[] = await validate(plainToClass(CategoryModel, catDTO));
        if (errors.length)
            throw new InvalidEntity(errors);

        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        const names : CategoryModel[] = await repo.find({where: {name: catDTO.name}});
        if (names.length > 0)
            throw new UniqNameError();

        try {
            await repo.insert(catDTO);
        } catch (e) {
            throw new QueryFailedError("INSERT", [catDTO], e);
        }

        return catDTO;
    }

    static editCategory = async (cid : string, catDTO : CategoryModel) : Promise<CategoryModel> => {
        const errors: ValidationError[] = await validate(plainToClass(CategoryModel, catDTO));
        if (errors.length > 0)
            throw new InvalidEntity(errors);

        await CategoryManager.getOne(cid);
        const repo: Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        const names : CategoryModel[] = await repo.find({where: {name: catDTO.name, id: Not(catDTO.id)}});
        if (names.length > 0)
            throw new UniqNameError();

        catDTO.id = cid;
        try {
            catDTO = await repo.save(catDTO);
        } catch (e) {
            throw new QueryFailedError("UPDATE", [catDTO], e);
        }
        return catDTO;
    };

    static deleteCategory = async (pid: string) => {
        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        await repo.remove(await CategoryManager.getOne(pid));
    }

}