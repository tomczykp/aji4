import {NextFunction, Request, Response} from "express";
import OrderManager from "../managers/order.manager";
import {OrderModel} from "../entity/order.entity";

export default class OrderController {

    static listAll = async (req: Request, res: Response): Promise<void> => {
        const orders : OrderModel[] = await OrderManager.listAll();
        res.status(200).json(orders);
    }

    static getOneById = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
        const oid : string = req.params.id;
        try {
            const order: OrderModel = await OrderManager.getOneById(oid);
            res.status(200).json(order);
        } catch (e) {
            return next(e);
        }
    }

    static addSubOrder = async (req : Request, res : Response, next : NextFunction) : Promise<void>=> {
        try {
            let order = await OrderManager.addSubOrder(req.params.id, req.body);
            res.status(200).json(order);
        } catch (e) {
            return next(e);
        }
    }


    static makeOrder = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
        try {
            let order = await OrderManager.makeOrder(req.body);
            res.status(200).json(order);
        } catch (e) {
            return next(e);
        }
    }


    static editOrder = async (req: Request, res: Response, next : NextFunction) : Promise<void>=> {
        try {
            const order : OrderModel = await OrderManager.editOrder(req.params.id, req.body);
            res.status(200).json(order);
        } catch (e) {
            return  next(e);
        }
    }

    static deleteOrder = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
        try {
            await OrderManager.deleteOrder(req.params.id);
            res.status(204).json();
        } catch (e) {
            return next(e);
        }
    }
}