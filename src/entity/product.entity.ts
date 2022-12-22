import {CategoryModel} from "./category.entity";
import {SubOrderModel} from "./single.order.entity";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsNotEmpty, Length} from "class-validator";

@Entity()
@Unique(["name"])
export class ProductModel {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @Length(4, 20)
    name: string;

    @Column({type: "float"})
    @IsNotEmpty()
    price: number;

    @Column({type: "float"})
    weight: number;

    @ManyToOne(() => CategoryModel, (category : CategoryModel)  => category.products)
    category: CategoryModel;

    @OneToMany(() => SubOrderModel, (order : SubOrderModel) => order.product)
    orders: SubOrderModel[];

}
