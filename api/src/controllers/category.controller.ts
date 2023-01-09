import {NextFunction, Request, Response} from "express";
import {CategoryModel} from "../entity/category.entity";
import CategoryManager from "../managers/category.manager";

export default class CategoryController {

    static getAll = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
		try {
	        const categories : CategoryModel[] = await CategoryManager.getAll();
	        res.status(200).json(categories);
		} catch (e) {
			return next(e);
		}
    }

    static getOne = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
        try {
            const product: CategoryModel = await CategoryManager.getOne(req.params.id);
            res.status(200).json(product);
        } catch (e) {
            return next(e);
        }
    }

    static newCategory = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
        try {
            let product = await CategoryManager.newCategory(req.body);
            res.status(200).json(product);
        } catch (e) {
            return next(e);
        }
    }


    static editCategory = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
        try {
            const product : CategoryModel = await CategoryManager.editCategory(req.params.id, req.body);
            res.status(200).json(product);
        } catch (e) {
            return  next(e);
        }
    }

    static deleteCategory = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
        try {
            await CategoryManager.deleteCategory(req.params.id);
            res.status(204).json();
        } catch (e) {
            return next(e);
        }
    }
}