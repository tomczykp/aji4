import {ProductModel} from "./product.entity";
import {OrderModel} from "./order.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty} from "class-validator";

@Entity()
export class SubOrderModel {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsNotEmpty()
    amount: number;

    @ManyToOne(() => ProductModel, (product :  ProductModel) => product.orders)
    product: ProductModel;

    @ManyToOne(() => OrderModel, (order :  OrderModel) => order.subOrders)
    order: OrderModel;
}
