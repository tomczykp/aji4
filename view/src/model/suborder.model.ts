import Product from "./product.model";
import Order from "./order.model";

export default interface SubOrder {
	id: string;
	product: Product;
	amount: number;
	order: Order;
}