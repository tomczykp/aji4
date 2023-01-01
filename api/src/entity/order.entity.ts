import {SubOrderModel} from "./single.order.entity";
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

}
