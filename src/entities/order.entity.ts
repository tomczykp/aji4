import SubOrderModel from "./single.order.entity";
import {Column, CreateDateColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {IsNotEmpty} from "class-validator";
import UserModel from "./user.entity";

export default class OrderModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    @IsNotEmpty()
    status!: string;

    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => UserModel, (user : UserModel) => user.orders)
    user!: UserModel;

    @OneToMany(() => SubOrderModel, (suborder : SubOrderModel) => suborder.order)
    subOrders!: SubOrderModel[];

    total() : number {
        return this.subOrders.reduce((total : number, subOrder : SubOrderModel) => total + subOrder.product.price * subOrder.amount, 0);
    }

    amount() : number {
        return this.subOrders.reduce((total : number, subOrder :  SubOrderModel) => total + subOrder.amount, 0);
    }

}

exports.module = OrderModel;