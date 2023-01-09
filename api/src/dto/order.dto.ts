import {OrderStatus} from "../entity/order.status";
import {SuborderDTO} from "./suborder.dto";

export interface OrderDTO {
    status: OrderStatus;
    user: string;
    subOrders: SuborderDTO[];
}