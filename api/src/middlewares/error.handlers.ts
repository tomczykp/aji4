import {Response, Request, NextFunction, Application} from "express";
import {QueryFailedError} from "typeorm";
import UniqNameError from "../errors/username.taken";
import InvalidEntity from "../errors/invalid.entity";

const errorHandler = (app : Application) => {

    // error logger
    app.use((error : Error, req: Request, res: Response, next: NextFunction) => {
        console.log(`Error [${error.name}] logging: ${error.message}`);
        return next(error);
    });


    app.use((error : Error, req: Request, res: Response, next: NextFunction) => {
        if (error.name != "InvalidEntity" && !(error instanceof InvalidEntity))
            return next(error);

        res.status(400).json({"status": error.message});
    });

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error.name != "EntityNotFoundError")
            return next(error);
        res.status(404).json({"status": error.message});
    });

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error.name != "UniqNameError" && !(error instanceof UniqNameError))
            return next(error);

        res.status(409).json({"status": error.message});
    });

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error.name != "QueryFailedError" && !(error instanceof QueryFailedError))
            return next(error);

        res.status(501).json({"status": error.message});
    });

    app.use((error: Error, req: Request, res: Response) => {
	    return res.status(500).render('error', { error: error.message });
    });
}
export default errorHandler;