import Category from "./category.model";
import SubOrder from "./suborder.model";

export default interface Product {
	id: string;
	name: string;
	price: number;
	weight: number;
	category: Category;
	orders: SubOrder[];
}

export interface ProductRepr {
	productId: string;
	name: string;
	price: number;
	weight: number;
	categoryName: string;
}