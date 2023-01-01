import {EntityNotFoundError, Not, QueryFailedError, Repository} from "typeorm";
import {ProductModel} from "../entity/product.entity";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";
import {plainToClass} from "class-transformer";
import InvalidEntity from "../errors/invalid.entity";
import UniqNameError from "../errors/username.taken";

export default class ProductManager {
    static getAll = async () : Promise<ProductModel[]> => {
        const repo: Repository<ProductModel> = dbConn.getRepository(ProductModel);
        return await repo.find({
            relations: { category: true }
        });
    };

    static getOne = async (pid : string) : Promise<ProductModel> => {
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
        try {
            return await repo.findOneOrFail({
                where: {id: pid},
                relations: { category: true }
            });
        } catch (e) {
            throw new EntityNotFoundError(ProductModel, "id");
        }
    };

    static newProduct = async (productDTO : ProductModel) : Promise<ProductModel> => {
        const errors = await validate(plainToClass(ProductModel, productDTO));
        if (errors.length > 0) {
            console.log(`validation errors: ${errors}`);
            throw new InvalidEntity(errors);
        }

        const repo: Repository<ProductModel> = dbConn.getRepository(ProductModel);
        const names : ProductModel[] = await repo.find({where: {name: productDTO.name}});
        if (names.length > 0)
            throw new UniqNameError();

        try {
            await repo.insert(productDTO);
        } catch (e) {
            throw new QueryFailedError("INSERT", [productDTO], e);
        }
        return productDTO;
    };

    static editProduct = async (pid : string, productDTO : ProductModel) : Promise<ProductModel> => {
        const errors: ValidationError[] = await validate(plainToClass(ProductModel, productDTO));
        if (errors.length > 0)
            throw new InvalidEntity(errors);

        await ProductManager.getOne(pid);
        const repo: Repository<ProductModel> = dbConn.getRepository(ProductModel);

        const names : ProductModel[] = await repo.find({where: {name: productDTO.name, id: Not(productDTO.id)}});
        if (names.length > 0)
            throw new UniqNameError();

        productDTO.id = pid;
        try {
            productDTO = await repo.save(productDTO);
        } catch (e) {
            throw new QueryFailedError("UPDATE", [productDTO], e);
        }
        return productDTO;
    };

    static deleteProduct = async (pid: string) => {
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
        await repo.remove(await ProductManager.getOne(pid));
    }


}