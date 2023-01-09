import {OrderModel} from "../entity/order.entity";
import {EntityNotFoundError, QueryFailedError, Repository} from "typeorm";
import {dbConn} from "../app-data-source";
import {validate, ValidationError} from "class-validator";
import {SubOrderModel} from "../entity/suborder.entity";
import InvalidEntity from "../errors/invalid.entity";
import {OrderDTO} from "../dto/order.dto";
import UserManager from "./user.manager";
import {SuborderDTO} from "../dto/suborder.dto";
import ProductManager from "./product.manager";

export default class OrderManager {

	static getAll = async (id: string, rel: boolean = true): Promise<OrderModel[]> => {
		const repo: Repository<OrderModel> = dbConn.getRepository(OrderModel);

		//Get user role from the database
		const role: string = (await UserManager.getOne(id)).role;

		if (role == 'admin')
			return await repo.find({
				relations: {user: rel, subOrders: {product: rel}}
			});
		else {
			return await repo.find({
				where: {user: {id: id}},
				relations: {user: rel, subOrders: {product: rel}}
			});
		}
	};


	static getOne = async (pid: string, rel: boolean = true): Promise<OrderModel> => {
		const repo: Repository<OrderModel> = dbConn.getRepository(OrderModel);
		try {
			return await repo.findOneOrFail({
				where: {id: pid},
				relations: {user: rel, subOrders: {product: {category: rel}}}
			});
		} catch (e) {
			throw new EntityNotFoundError(OrderModel, "id");
		}
	};

	static addSubOrder = async (oid: string, subDTO: SuborderDTO): Promise<SubOrderModel> => {
		let sub: SubOrderModel = SubOrderModel.make(subDTO);
		sub.order = await OrderManager.getOne(oid);
		sub.product = await ProductManager.getOne(subDTO.product);

		const errors: ValidationError[] = await validate(sub);
		if (errors.length > 0)
			throw new InvalidEntity(errors);


		const subRepo: Repository<SubOrderModel> = dbConn.getRepository(SubOrderModel);

		try {
			sub = await subRepo.save(sub);
		} catch (e) {
			throw new QueryFailedError("UPDATE", [sub], e);
		}

		return sub;
	};

	static makeOrder = async (orderDTO: OrderDTO): Promise<OrderModel> => {
		let order: OrderModel = OrderModel.make(orderDTO);
		order.user = await UserManager.getOne(orderDTO.user, false);

		const repo: Repository<OrderModel> = dbConn.getRepository(OrderModel);
		const subRepo: Repository<SubOrderModel> = dbConn.getRepository(SubOrderModel);

		const errors = await validate(order);
		if (errors.length > 0) {
			throw new InvalidEntity(errors);
		}

		try {
			await repo.insert(order);
		} catch (e) {
			throw new QueryFailedError("INSERT", [order], e);
		}

		for (let subDTO of orderDTO.subOrders) {
			let sub: SubOrderModel = SubOrderModel.make(subDTO);
			sub.product = await ProductManager.getOne(subDTO.product, false);
			sub.order = order;

			const errors: ValidationError[] = await validate(sub);
			if (errors.length > 0)
				throw new InvalidEntity(errors);

			try {
				await subRepo.insert(sub);
			} catch (e) {
				throw new QueryFailedError("INSERT", [sub], e);
			}
		}

		return order;
	};

	static editOrder = async (pid: string, orderDTO: OrderDTO): Promise<OrderModel> => {
		let order: OrderModel = OrderModel.make(orderDTO);
		order.user = await UserManager.getOne(orderDTO.user, false);

		const repo: Repository<OrderModel> = dbConn.getRepository(OrderModel);
		const subRepo: Repository<SubOrderModel> = dbConn.getRepository(SubOrderModel);
		const orig: OrderModel = await OrderManager.getOne(pid, false);
		let res = {
			...orig,
			...order
		}
		res.id = pid;

		const errors: ValidationError[] = await validate(res);
		if (errors.length > 0) {
			throw new InvalidEntity(errors);

		}

		try {
			res = await repo.save(res);
		} catch (e) {
			throw new QueryFailedError("UPDATE", [res], e);
		}

		if (orderDTO.subOrders) {
			for (let subDTO of orderDTO.subOrders) {
				let sub: SubOrderModel = SubOrderModel.make(subDTO);
				sub.product = await ProductManager.getOne(subDTO.product, false);
				sub.order = res;

				const errors: ValidationError[] = await validate(sub);
				if (errors.length > 0)
					throw new InvalidEntity(errors);

				try {
					await subRepo.insert(sub);
				} catch (e) {
					throw new QueryFailedError("INSERT", [sub], e);
				}
			}
		}

		return res;
	};

	static deleteOrder = async (pid: string) => {
		const repo: Repository<OrderModel> = dbConn.getRepository(OrderModel);
		await repo.remove(await OrderManager.getOne(pid));
	};

}