import "reflect-metadata";
import express from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from 'cors';
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import {Config} from './config/environment';
import {dbConn} from "./app-data-source";

dbConn
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        const app : express.Application = express();

        app.use(express.json());
        app.use(cors());
        app.use(helmet());
        app.use(bodyParser.json());

        //Set all routes from routes folder
        app.use("/user", userRouter);
        app.use("/auth", authRouter);

        app.listen(Config.port, () => {
            console.log(`Server started on port ${Config.port}!`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    })

