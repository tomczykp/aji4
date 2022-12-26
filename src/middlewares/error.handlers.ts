import {Response, Request, NextFunction, Application} from "express";
import {QueryFailedError} from "typeorm";
import {ValidationError} from "class-validator";
import UserNameError from "../errors/username.taken";

const errorHandler = (app : Application) => {

    // error logger
    app.use((error : Error, req: Request, res: Response, next: NextFunction) => {
        console.log(`Error [${error.name}] logging: ${error.message}`);
        return next(error);
    });


    app.use((error : Error, req: Request, res: Response, next: NextFunction) => {
        if (error.name != "ValidationError" && !(error instanceof ValidationError))
            return next(error);

        res.status(400).json(error);
    });

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error.name != "EntityNotFoundError")
            return next(error);
        res.status(404).json();
    });

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error.name != "UserNameError" && !(error instanceof UserNameError))
            return next(error);

        res.status(409).json();
    });

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error.name != "QueryFailedError" && !(error instanceof QueryFailedError))
            return next(error);

        res.status(503).json();
    });

    app.use((error: Error, req: Request, res: Response) => {
        res.status(500).json();
    });
}
export default errorHandler;