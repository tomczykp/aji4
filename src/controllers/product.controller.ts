import {Request, Response} from "express";
import {Repository} from "typeorm";
import {ProductModel} from "../entity/product.entity";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";

export default class ProductController {

    static listAll = async (req: Request, res: Response) => {
        try {
            const repo: Repository<ProductModel> = dbConn.getRepository(ProductModel);
            const products: ProductModel[] = await repo.find(); // brak params == all
            res.json(products);
        } catch (errors) {
            res.status(500).json(errors);
        }
    }

    static getOneById = async (req: Request, res: Response) => {
        const pid = req.params.id;
        try {
            const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
            const product : ProductModel = await repo.findOneOrFail({
                where: {id: pid}
            });
            res.json(product);
        } catch (error) {
            res.status(404).json(`product with id: ${pid} not found`);
        }
    }


    static newProduct = async (req: Request, res: Response) => {
        let product: ProductModel = req.body;
        const errors = await validate(product);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        try {
            const repo: Repository<ProductModel> = dbConn.getRepository(ProductModel);
            await repo.insert(product);
            res.status(200).json(product);
        } catch (errors) {
            res.status(500).json(errors);
        }
    }

    static editProduct = async (req: Request, res: Response) => {
        const pid: string = req.params.id;
        const productDTO : ProductModel = req.body;
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
        let product: ProductModel;
        try {
            product = await repo.findOneOrFail({where: {id: pid}});
        } catch (error) {
            res.status(404).json(`product with id: ${pid} not found`);
            return;
        }

        //Validate the new values on entity
        const errors: ValidationError[] = await validate(productDTO);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        product = productDTO;
        product.id = pid; // not sure if necessary
        await repo.save(product);
        res.status(200).json(product);
    }

    static deleteProduct = async (req: Request, res: Response) => {
        const pid : string = req.params.id;
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
        try {
            await repo.findOneOrFail({where: {id: pid}});
        } catch (error) {
            res.status(404).json(`product with id: ${pid} not found`);
            return;
        }
        await repo.delete(pid);

        //After all send a 204 (no content, but accepted) response
        res.status(204).json();
    }

}