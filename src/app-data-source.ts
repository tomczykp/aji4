import {DataSource} from "typeorm";

export const dbConn = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "aji",
    password: "passwd",
    database: "aji4",
    entities: ["src/entities/*.entity.*"],
    logging: true,
    synchronize: true,
});
