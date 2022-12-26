import {NextFunction, Request, Response} from "express";
import {ProductModel} from "../entity/product.entity";
import ProductManager from "../managers/product.manager";

export default class ProductController {

    static listAll = async (req: Request, res: Response) => {
        const products : ProductModel[] = await ProductManager.listAll();
        res.status(200).json(products)
    }

    static getOneById = async (req: Request, res: Response, next : NextFunction) => {
        const pid : string = req.params.id;
        try {
            const product: ProductModel = await ProductManager.getOneById(pid);
            res.status(200).json(product);
        } catch (e) {
            return next(e);
        }
    }


    static newProduct = async (req: Request, res: Response, next : NextFunction) => {
        try {
            let product = await ProductManager.newProduct(req.body);
            res.status(200).json(product);
        } catch (e) {
            return next(e);
        }
    }


    static editProduct = async (req: Request, res: Response, next : NextFunction) => {
        try {
            const product : ProductModel = await ProductManager.editProduct(req.params.id, req.body);
            res.status(200).json(product);
        } catch (e) {
            return  next(e);
        }
    }

    static deleteProduct = async (req: Request, res: Response, next : NextFunction) => {
        try {
            await ProductManager.deleteProduct(req.params.id);
            res.status(204).json();
        } catch (e) {
            return next(e);
        }
    }

}