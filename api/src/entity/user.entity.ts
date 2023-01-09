import {Length, IsNotEmpty, IsString} from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import {OrderModel} from "./order.entity";
import {UserDTO} from "../dto/user.dto";

@Entity()
@Unique(["username"])
export class UserModel {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsString()
    @Length(4, 20)
    username: string;

    @Column()
    @IsString()
    @Length(4, 100)
    password: string;

    @Column()
    @IsString()
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

    static make(dto: UserDTO) : UserModel {
        let user : UserModel = new UserModel();
        user.username = dto.username;
        user.password = dto.password;
        user.role = dto.role;
        return user;
    }

}

