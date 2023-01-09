import {ProductModel} from "./product.entity";
import {OrderModel} from "./order.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, IsNumber} from "class-validator";
import {SuborderDTO} from "../dto/suborder.dto";

@Entity()
export class SubOrderModel {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @ManyToOne(() => ProductModel, (product :  ProductModel) => product.orders)
    product: ProductModel;

    @IsNotEmpty()
    @ManyToOne(() => OrderModel, (order :  OrderModel) => order.subOrders, {onDelete: "CASCADE"})
    order: OrderModel;

    static make(dto : SuborderDTO) : SubOrderModel {
        let sub : SubOrderModel = new SubOrderModel();
        sub.amount = dto.amount;
        return sub;
    }
}
