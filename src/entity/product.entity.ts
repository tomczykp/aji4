import {CategoryModel} from "./category.entity";
import {SubOrderModel} from "./single.order.entity";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsNotEmpty, IsNumber, IsString, IsUUID, Length} from "class-validator";

@Entity()
@Unique(["name"])
export class ProductModel {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column()
    @IsString()
    @Length(4, 20)
    name: string;

    @Column({type: "float"})
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @Column({type: "float"})
    @IsNumber()
    weight: number;

    @IsNotEmpty()
    @ManyToOne(() => CategoryModel, (category : CategoryModel)  => category.products)
    category: CategoryModel;

    @OneToMany(() => SubOrderModel, (order : SubOrderModel) => order.product)
    orders: SubOrderModel[];

}
