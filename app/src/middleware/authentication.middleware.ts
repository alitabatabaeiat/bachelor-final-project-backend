import express from "express";
import {Request} from '@interfaces';
import _ from "lodash";
import UnAuthorizedException from "../exceptions/unAuthorized.execption";

const authenticationMiddleware = () =>
    (req: Request, res: express.Response, next: express.NextFunction): void => {
        const token = req.header('token');
        if (!token)
            next(new UnAuthorizedException('No token provided'));
        if (_.isNaN(token))
            next(new UnAuthorizedException('Invalid Token'));
        req.user = {
            id: parseInt(token)
        };
        next()
    };

export default authenticationMiddleware;
