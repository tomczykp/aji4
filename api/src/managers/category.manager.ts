import {CategoryModel} from "../entity/category.entity";
import {EntityNotFoundError, Not, QueryFailedError, Repository} from "typeorm";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";
import InvalidEntity from "../errors/invalid.entity";
import UniqNameError from "../errors/username.taken";
import {CategoryDTO} from "../dto/category.dto";

export default class CategoryManager {

    static getAll = async (rel : boolean = true) : Promise<CategoryModel[]> => {
        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        return await repo.find({relations: {products: rel}});
    }

    static getOne = async (cid : string, rel : boolean = true) : Promise<CategoryModel> => {
        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        try {
            return await repo.findOneOrFail({
                where: {id: cid},
                relations: {products: rel}
            });
        } catch (e) {
            throw new EntityNotFoundError(CategoryModel, "id");
        }
    }

    static newCategory = async (catDTO : CategoryDTO) : Promise<CategoryModel> => {
        let category : CategoryModel = CategoryModel.make(catDTO);
        const errors: ValidationError[] = await validate(category);
        if (errors.length)
            throw new InvalidEntity(errors);

        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        const names : CategoryModel[] = await repo.find({where: {name: category.name}});
        if (names.length > 0)
            throw new UniqNameError();

        try {
            await repo.insert(category);
        } catch (e) {
            throw new QueryFailedError("INSERT", [category], e);
        }

        return category;
    }

    static editCategory = async (cid : string, catDTO : CategoryDTO) : Promise<CategoryModel> => {
        let category : CategoryModel = CategoryModel.make(catDTO);
        const errors: ValidationError[] = await validate(category);
        if (errors.length > 0)
            throw new InvalidEntity(errors);

        await CategoryManager.getOne(cid);
        const repo: Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        const names : CategoryModel[] = await repo.find({where: {name: category.name, id: Not(category.id)}});
        if (names.length > 0)
            throw new UniqNameError();

        category.id = cid;
        try {
            category = await repo.save(category);
        } catch (e) {
            throw new QueryFailedError("UPDATE", [category], e);
        }
        return category;
    };

    static deleteCategory = async (pid: string) => {
        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        await repo.remove(await CategoryManager.getOne(pid));
    }

}