import {CategoryModel} from "../entity/category.entity";
import {EntityNotFoundError, QueryFailedError, Repository} from "typeorm";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";

export default class CategoryManager {

    static getAll = async () : Promise<CategoryModel[]> => {
        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        return await repo.find();
    }

    static getOne = async (cid : string) : Promise<CategoryModel> => {
        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        try {
            return await repo.findOneOrFail({where: {id: cid}});
        } catch (e) {
            throw new EntityNotFoundError(CategoryModel, "id");
        }
    }

    static newCategory = async (catDTO : CategoryModel) : Promise<CategoryModel> => {
        const errors: ValidationError[] = await validate(catDTO);
        if (errors.length)
            throw new ValidationError();

        const repo : Repository<CategoryModel> = dbConn.getRepository(CategoryModel);
        try {
            await repo.insert(catDTO);
        } catch (e) {
            throw new QueryFailedError("INSERT", [catDTO], e);
        }

        return catDTO;
    }

    static editCategory = async (cid : string, catDTO : CategoryModel) : Promise<CategoryModel> => {
        const errors: ValidationError[] = await validate(catDTO);
        if (errors.length > 0)
            throw new ValidationError();

        await CategoryManager.getOne(cid);
        const repo: Repository<CategoryModel> = dbConn.getRepository(CategoryModel);

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