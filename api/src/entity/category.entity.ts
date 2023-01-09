import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsNotEmpty, IsString, Length} from "class-validator";
import {ProductModel} from "./product.entity";
import {CategoryDTO} from "../dto/category.dto";

@Entity()
@Unique(["name"])
export class CategoryModel {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    @Length(4, 20)
    name: string;

    @OneToMany(() => ProductModel, (product : ProductModel) => product.category)
    products: ProductModel[];

    static make(dto: CategoryDTO) : CategoryModel {
        let cat : CategoryModel = new CategoryModel();
        cat.name = dto.name;
        return cat;
    }


}

