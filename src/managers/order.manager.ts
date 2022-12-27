import {OrderModel} from "../entity/order.entity";
import {EntityNotFoundError, QueryFailedError, Repository} from "typeorm";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";
import {SubOrderModel} from "../entity/single.order.entity";

export default class OrderManager {

    static listAll = async () : Promise<OrderModel[]> => {
        const repo: Repository<OrderModel> = dbConn.getRepository(OrderModel);
        return await repo.find();
    }

    static getOneById = async (pid : string) : Promise<OrderModel> => {
        const repo : Repository<OrderModel> = dbConn.getRepository(OrderModel);
        try {
            return await repo.findOneOrFail({where: {id: pid}});
        } catch (e) {
            throw new EntityNotFoundError(OrderModel, "id");
        }
    };

    static addSubOrder = async (oid : string, suborderDTO : SubOrderModel) : Promise<OrderModel> => {
        const errors: ValidationError[] = await validate(suborderDTO);
        if (errors.length > 0)
            throw new ValidationError();

        let order : OrderModel = await OrderManager.getOneById(oid);
        order.subOrders.push(suborderDTO);

        const subRepo : Repository<SubOrderModel> = dbConn.getRepository(SubOrderModel);
        const repo : Repository<OrderModel> = dbConn.getRepository(OrderModel);

        try {
            order = await repo.save(order);
            suborderDTO = await subRepo.save(suborderDTO);
        } catch (e) {
            throw new QueryFailedError("UPDATE", [suborderDTO], e);
        }

        return order;
    }

    static makeOrder = async (orderDTO : OrderModel) : Promise<OrderModel> => {
        const errors = await validate(orderDTO);
        if (errors.length > 0) {
            console.log(`validation errors: ${errors}`);
            throw new ValidationError();
        }

        const repo: Repository<OrderModel> = dbConn.getRepository(OrderModel);
        try {
            await repo.insert(orderDTO);
        } catch (e) {
            throw new QueryFailedError("INSERT", [orderDTO], e);
        }
        return orderDTO;
    };

    static editOrder = async (pid : string, orderDTO : OrderModel) : Promise<OrderModel> => {
        const errors: ValidationError[] = await validate(orderDTO);
        if (errors.length > 0)
            throw new ValidationError();

        await OrderManager.getOneById(pid);
        const repo: Repository<OrderModel> = dbConn.getRepository(OrderModel);

        orderDTO.id = pid;
        try {
            orderDTO = await repo.save(orderDTO);
        } catch (e) {
            throw new QueryFailedError("UPDATE", [orderDTO], e);
        }
        return orderDTO;
    };

    static deleteOrder = async (pid: string) => {
        const repo : Repository<OrderModel> = dbConn.getRepository(OrderModel);
        await repo.remove(await OrderManager.getOneById(pid));
    }

    static total(order : OrderModel) : number {
        return order.subOrders.reduce((total : number, subOrder : SubOrderModel) => total + subOrder.product.price * subOrder.amount, 0);
    }

    static amount(order : OrderModel) : number {
        return order.subOrders.reduce((total : number, subOrder :  SubOrderModel) => total + subOrder.amount, 0);
    }

}