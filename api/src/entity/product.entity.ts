import {CategoryModel} from "./category.entity";
import {SubOrderModel} from "./suborder.entity";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";
import ProductDTO from "../dto/product.dto";

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

    static make(dto: ProductDTO) : ProductModel {
        let product : ProductModel = new ProductModel();
        product.name = dto.name;
        product.price = dto.price;
        product.weight = dto.weight;
        return product;
    }


}
