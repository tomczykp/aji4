import Product from "./product.model";

export default interface Category {
	id: string;
	name: string;
	products: Product[];
}

export interface CategoryRepr {
	categoryId: string;
	name: string;
	productCount: number;
}