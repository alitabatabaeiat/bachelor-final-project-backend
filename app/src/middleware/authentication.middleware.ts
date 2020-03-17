import express from "express";
import {Request} from '@interfaces';
import _ from "lodash";

const authenticationMiddleware = () =>
    (req: Request, res: express.Response, next: express.NextFunction): void => {
        req.user = {id: 1};
        next()
    };

export default authenticationMiddleware;
