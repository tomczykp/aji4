import {Request, Response} from "express";
import ProductController from "../controllers/product.controller";

export default class ProductManager {
    static listAll = async (req: Request, res : Response) => ProductController.listAll(req, res);
    static getOneById = async (req: Request, res : Response) => ProductController.getOneById(req, res);
    static newProduct = async (req: Request, res : Response) => ProductController.newProduct(req, res);
    static editProduct = async (req: Request, res : Response) => ProductController.editProduct(req, res);
    static deleteProduct = async (req: Request, res : Response) => ProductController.deleteProduct(req, res);

}