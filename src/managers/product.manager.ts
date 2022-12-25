import {EntityNotFoundError, Repository} from "typeorm";
import {ProductModel} from "../entity/product.entity";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";

export default class ProductManager {
    static listAll = async () : Promise<ProductModel[]> => {
        const repo: Repository<ProductModel> = dbConn.getRepository(ProductModel);
        return await repo.find();
    };

    static getOneById = async (pid : string) : Promise<ProductModel> => {
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
        try {
            return await repo.findOneOrFail({where: {id: pid}});
        } catch (e) {
            throw new EntityNotFoundError(ProductModel, "id");
        }
    };

    static newProduct = async (productDTO : ProductModel) : Promise<ProductModel> => {
        const errors = await validate(productDTO);
        if (errors.length > 0)
            throw new ValidationError();

        const repo: Repository<ProductModel> = dbConn.getRepository(ProductModel);
        await repo.insert(productDTO);
        return productDTO;
    };

    static editProduct = async (pid : string, productDTO : ProductModel) : Promise<ProductModel> => {
        const errors: ValidationError[] = await validate(productDTO);
        if (errors.length > 0)
            throw new ValidationError();

        await ProductManager.getOneById(pid);
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);

        productDTO.id = pid;
        await repo.save(productDTO);
        return productDTO;
    };

    static deleteProduct = async (pid: string) => {
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
        await repo.remove(await repo.findOneOrFail({where: {id: pid}}));
    }


}