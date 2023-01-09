import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import * as cors from 'cors';
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import orderRouter from "./routes/order.route";
import categoryRouter from "./routes/category.route";
import errorHandler from "./middlewares/error.handlers";
import {Config} from './config/environment';
import {dbConn} from "./app-data-source";

dbConn
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        const corsOptions = {
            origin: 'http://localhost:4200',
            optionsSuccessStatus: 200
        };
        const app : express.Application = express();

        app.use(express.json());
        app.use(cors(corsOptions));
        app.use(helmet());
	    app.use(bodyParser.urlencoded({ extended: true }));
	    app.use(bodyParser.json());

        //Set all routes from routes folder
        app.use("/user", userRouter);
        app.use("/", authRouter);
        app.use("/product", productRouter);
        app.use("/order", orderRouter);
        app.use("/category", categoryRouter);
        errorHandler(app);

        app.listen(Config.port, () => {
            console.log(`Server started on port ${Config.port}!`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    })
