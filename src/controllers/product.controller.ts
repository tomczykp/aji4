import {Request, Response} from "express";
import {Repository} from "typeorm";
import ProductModel from "../entities/product.entity";
import {dbConn} from "../app-data-source";

export default class ProductController {

    static listAll = async (req: Request, res: Response) => {
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
        const products : ProductModel[] = await repo.find();
        res.json(products);
    }


    static getOneById = async (req: Request, res: Response) => {
        const repo : Repository<ProductModel> = dbConn.getRepository(ProductModel);
        const pid = req.params.id;
        try {
            const product : ProductModel = await repo.findOneOrFail({
                where: {id: pid}
            });
            res.json(product);
        } catch (error) {
            res.status(404).json("product not found");
        }
    }


    static newProduct = async (req: Request, res: Response) => {

    }

    static editProduct = async (req: Request, res: Response) => {

    }

}