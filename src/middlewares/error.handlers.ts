import {Response, Request, NextFunction, Router} from "express";
import {ValidationError} from "class-validator";
import {EntityNotFoundError, QueryFailedError} from "typeorm";
import UserNameError from "../errors/username.taken";

const router = Router();

router.use((error : Error, req: Request, res: Response, next : NextFunction) => {
    console.log(error.message);
    if (!(error instanceof ValidationError))
        next();
    res.status(400).json(error);
});

router.use((error : Error, req: Request, res: Response, next : NextFunction) => {
    if (!(error instanceof EntityNotFoundError))
        next();
    res.status(404).json();
});

router.use((error : Error, req: Request, res: Response, next : NextFunction) => {
    if (!(error instanceof UserNameError))
        next();

    res.status(409).json();
});

router.use((error : Error, req: Request, res: Response, next : NextFunction) => {
    if (!(error instanceof QueryFailedError))
        next();

    res.status(500).json();
});

export default router;