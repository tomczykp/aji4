import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsString, IsUUID, Length} from "class-validator";
import {ProductModel} from "./product.entity";

@Entity()
@Unique(["name"])
export class CategoryModel {
    @IsUUID()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsString()
    @Length(4, 20)
    name: string;

    @OneToMany(() => ProductModel, (product : ProductModel) => product.category)
    products: ProductModel[];
}

