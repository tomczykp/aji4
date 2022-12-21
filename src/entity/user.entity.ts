import {Length, IsNotEmpty} from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import {OrderModel} from "./order.entity";

@Entity()
@Unique(["username"])
export class UserModel {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(4, 100)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => OrderModel, (order: OrderModel) => order.user)
    orders: OrderModel[];

}

