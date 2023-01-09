import SubOrder from "./suborder.model";
import User from "./user.model";

export default interface Order {
	id: string;
	status: number;
	createdAt: Date;
	updatedAt: Date;
	user: User;
	subOrders: SubOrder[];
}