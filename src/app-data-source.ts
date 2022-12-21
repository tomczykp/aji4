import {DataSource} from "typeorm";
import {ProductModel} from "./entity/product.entity";
import {UserModel} from "./entity/user.entity";
import {SubOrderModel} from "./entity/single.order.entity";
import {OrderModel} from "./entity/order.entity";
import {CategoryModel} from "./entity/category.entity";

export const dbConn = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "aji",
    password: "passwd",
    database: "aji4",
    // entities: ["src/entity/*.js"],
    entities: [ProductModel, UserModel, SubOrderModel, OrderModel, CategoryModel],
    logging: true,
    synchronize: true,
});
