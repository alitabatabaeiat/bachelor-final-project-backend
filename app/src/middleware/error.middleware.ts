import express from "express";
import {Request} from '@interfaces';
import {ConflictException, HttpException, ResourceNotFoundException, ValidationException} from '@exceptions';
import {winston} from '@utils';

const errorMiddleware = () =>
    (error: HttpException, req: Request, res: express.Response, next: express.NextFunction) => {
        console.log(error);
        res.status(error.status);
        if (error instanceof ResourceNotFoundException)
            res.jsend.fail(error.message);
        else if (error instanceof ValidationException)
            res.jsend.fail(error.errors);
        else if (error instanceof ConflictException)
            res.jsend.fail(error.message);
        else
            res.jsend.error(error.message);
        winston.error(error);
    };

export default errorMiddleware;
