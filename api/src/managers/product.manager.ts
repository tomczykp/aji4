import {EntityNotFoundError, Not, QueryFailedError, Repository} from "typeorm";
import {ProductModel} from "../entity/product.entity";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";
import InvalidEntity from "../errors/invalid.entity";
import UniqNameError from "../errors/username.taken";
import CategoryManager from "./category.manager";
import ProductDTO from "../dto/product.dto";

export default class ProductManager {
    static getAll = async (rel : boolean = true) : Promise<ProductModel[]> => {
        const repo: Repository<ProductModel> = dbConn.getRepository(ProductModel);
        return await repo.find({
            relations: { category: rel, orders: rel }
        });
    };

    static getOne = async (pid : string, rel : boolean = true) : Promise<ProductModel> => {
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
        try {
            return await repo.findOneOrFail({
                where: {id: pid},
                relations: { category: rel, orders: rel }
            });
        } catch (e) {
            throw new EntityNotFoundError(ProductModel, "id");
        }
    };

    static newProduct = async (productDTO : ProductDTO) : Promise<ProductModel> => {
        let product : ProductModel = ProductModel.make(productDTO);
        product.category = await CategoryManager.getOne(productDTO.category);

        const errors = await validate(product);
        if (errors.length > 0) {
            throw new InvalidEntity(errors);
        }

        const repo: Repository<ProductModel> = dbConn.getRepository(ProductModel);
        const names : ProductModel[] = await repo.find({where: {name: product.name}});
        if (names.length > 0)
            throw new UniqNameError();

        try {
            await repo.insert(product);
        } catch (e) {
            throw new QueryFailedError("INSERT", [product], e);
        }
        return product;
    };

    static editProduct = async (pid : string, productDTO : ProductDTO) : Promise<ProductModel> => {
        let product : ProductModel = ProductModel.make(productDTO);
        product.category = await CategoryManager.getOne(productDTO.category);

        const errors: ValidationError[] = await validate(product);
        if (errors.length > 0)
            throw new InvalidEntity(errors);

        const repo: Repository<ProductModel> = dbConn.getRepository(ProductModel);
        const names : ProductModel[] = await repo.find({where: {name: product.name, id: Not(pid)}});
        if (names.length > 0)
            throw new UniqNameError();

        await ProductManager.getOne(pid);
        product.id = pid;
        try {
            product = await repo.save(product);
        } catch (e) {
            throw new QueryFailedError("UPDATE", [product], e);
        }
        return product;
    };

    static deleteProduct = async (pid: string) => {
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
        await repo.remove(await ProductManager.getOne(pid));
    }


}