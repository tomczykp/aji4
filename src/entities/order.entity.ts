import SubOrderModel from "./single.order.entity";
import {Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {IsNotEmpty} from "class-validator";

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

    @OneToMany(() => SubOrderModel, (suborder : SubOrderModel) => suborder.order)
    subOrders!: SubOrderModel[];

}