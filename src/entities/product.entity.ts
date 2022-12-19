import CategoryModel from "./category.entity";
import SubOrderModel from "./single.order.entity";
import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsNotEmpty, Length} from "class-validator";

@Entity()
@Unique(["name"])
export default class ProductModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    @Length(4, 20)
    name!: string;

    @Column()
    @IsNotEmpty()
    price!: number;

    @Column()
    weight!: number;

    @ManyToOne(() => CategoryModel, (category : CategoryModel)  => category.products)
    category!: CategoryModel;

    @OneToOne(() => SubOrderModel, (order : SubOrderModel) => order.product)
    orders!: SubOrderModel[];

}