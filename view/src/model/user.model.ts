import SubOrder from "./suborder.model";

export default interface User {
	id: string;
	username: string;
	password: string;
	orders: SubOrder[];
}