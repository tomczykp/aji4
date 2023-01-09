import {NextFunction, Request, Response} from "express";
import {ProductModel} from "../entity/product.entity";
import ProductManager from "../managers/product.manager";

export default class ProductController {

    static getAll = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
		try {
	        const products : ProductModel[] = await ProductManager.getAll();
	        res.status(200).json(products);
		} catch (e) {
			return next(e);
		}
    }

    static getOne = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
        const pid : string = req.params.id;
        try {
            const product: ProductModel = await ProductManager.getOne(pid);
            res.status(200).json(product);
        } catch (e) {
            return next(e);
        }
    }


    static newProduct = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
        try {
            let product = await ProductManager.newProduct(req.body);
            res.status(200).json(product);
        } catch (e) {
            return next(e);
        }
    }


    static editProduct = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
        try {
            const product : ProductModel = await ProductManager.editProduct(req.params.id, req.body);
            res.status(200).json(product);
        } catch (e) {
            return  next(e);
        }
    }

    static deleteProduct = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
        try {
            await ProductManager.deleteProduct(req.params.id);
            res.status(204).json();
        } catch (e) {
            return next(e);
        }
    }

}