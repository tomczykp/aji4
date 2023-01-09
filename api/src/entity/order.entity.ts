import {SubOrderModel} from "./suborder.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {IsNotEmpty, IsNumber} from "class-validator";
import {UserModel} from "./user.entity";
import {OrderStatus} from "./order.status";
import {OrderDTO} from "../dto/order.dto";

@Entity()
export class OrderModel {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsNumber()
    @IsNotEmpty()
    status: OrderStatus;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @IsNotEmpty()
    @ManyToOne(() => UserModel, (user : UserModel) => user.orders)
    user: UserModel;

    @OneToMany(() => SubOrderModel, (suborder : SubOrderModel) => suborder.order)
    subOrders: SubOrderModel[];

    static make(dto : OrderDTO) : OrderModel {
        let order : OrderModel = new OrderModel();
        order.status = dto.status ? dto.status : OrderStatus.Received;
        return order;
    }
}
