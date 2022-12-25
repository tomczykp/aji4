import {Request, Response} from "express";
import {ProductModel} from "../entity/product.entity";
import ProductManager from "../managers/product.manager";

export default class ProductController {

    static listAll = async (req: Request, res: Response) => {
        const products : ProductModel[] = await ProductManager.listAll();
        res.status(200).json(products)
    }

    static getOneById = async (req: Request, res: Response) => {
        const pid : string = req.params.id;
        const product : ProductModel = await ProductManager.getOneById(pid)
        res.status(200).json(product);
    }


    static newProduct = async (req: Request, res: Response) => {
        let product = await ProductManager.newProduct(req.body);
        res.status(200).json(product);
    }


    static editProduct = async (req: Request, res: Response) => {
        const product : ProductModel = await ProductManager.editProduct(req.params.id, req.body);
        res.status(200).json(product);
    }

    static deleteProduct = async (req: Request, res: Response) => {
        await ProductManager.deleteProduct(req.params.id);
        res.status(204).json();
    }

}