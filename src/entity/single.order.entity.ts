import {ProductModel} from "./product.entity";
import {OrderModel} from "./order.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, IsNumber, IsUUID} from "class-validator";

@Entity()
export class SubOrderModel {
    @IsUUID()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ManyToOne(() => ProductModel, (product :  ProductModel) => product.orders)
    product: ProductModel;

    @ManyToOne(() => OrderModel, (order :  OrderModel) => order.subOrders)
    order: OrderModel;
}
