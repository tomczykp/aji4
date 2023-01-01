import {CategoryModel} from "./category.entity";
import {SubOrderModel} from "./single.order.entity";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";

@Entity()
@Unique(["name"])
export class ProductModel {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    @Length(4, 20)
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @Column({type: "float"})
    price: number;

    @IsNumber()
    @IsNotEmpty()
    @Column({type: "float"})
    weight: number;

    @IsNotEmpty()
    @ManyToOne(() => CategoryModel, (category : CategoryModel)  => category.products)
    category: CategoryModel;

    @OneToMany(() => SubOrderModel, (order : SubOrderModel) => order.product)
    orders: SubOrderModel[];

}
