import express from "express";
import {Request} from '@interfaces';
import {ResourceNotFoundException} from "@exceptions";

const notFoundMiddleware = () =>
    (req: Request, res: express.Response, next: express.NextFunction) =>
        next(new ResourceNotFoundException('404 Not Found'));

export default notFoundMiddleware;
