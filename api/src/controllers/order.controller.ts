import {NextFunction, Request, Response} from "express";
import OrderManager from "../managers/order.manager";
import {OrderModel} from "../entity/order.entity";
import {Config} from "../config/environment";
import {JwtPayload} from "jsonwebtoken";
import * as jwt from "jsonwebtoken";

export default class OrderController {

    static getAll = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
		try {
		    const authHeader = req.headers.authorization;

		    if (authHeader) {
			    const token = authHeader.split(' ')[1];
			    const payload: JwtPayload = <JwtPayload>jwt.verify(token, Config.jwtSecret);
			    const orders: OrderModel[] = await OrderManager.getAll(payload.userId);
			    res.status(200).json(orders);
		    } else {
				res.status(401).send();
		    }
		} catch (e) {
			return next(e);
		}
    }

    static getOne = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
        const oid : string = req.params.id;
        try {
            const order: OrderModel = await OrderManager.getOne(oid);
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


    static incStatus = async (req: Request, res: Response, next : NextFunction) : Promise<void>=> {
        try {
            const order : OrderModel = await OrderManager.changeStatus(req.params.id, true);
            res.status(200).json(order);
        } catch (e) {
            return  next(e);
        }
    }

	static decStatus = async (req: Request, res: Response, next : NextFunction) : Promise<void>=> {
		try {
			const order : OrderModel = await OrderManager.changeStatus(req.params.id, false);
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