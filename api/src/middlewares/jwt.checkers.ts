import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import {Config} from "../config/environment";
import {JwtPayload} from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    const token = req.headers.authorization.split(' ')[1];
    let jwtPayload;

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, Config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send();
        return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, username, role } = jwtPayload;
    const newToken = jwt.sign({ userId, username, role }, Config.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();
};

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

	    if (authHeader) {
		    const token = authHeader.split(' ')[1];
		    const payload: JwtPayload = <JwtPayload>jwt.verify(token, Config.jwtSecret);


		    //Check if array of authorized roles includes the user's role
		    if (roles.indexOf(payload.role) > -1)
			    next();
		    else
			    res.status(401).send();
	    }
		else {
		    res.status(401).send();
	    }
    };
};