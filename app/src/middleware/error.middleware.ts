import {NextFunction, Request, Response} from 'express';
import {ConflictException, HttpException, ResourceNotFoundException, ValidationException} from '@exceptions';
import {winston} from '@utils';

const errorMiddleware = () =>
    (error: HttpException, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof ResourceNotFoundException)
            res.status(error.status).jsend.fail(error.message);
        else if (error instanceof ValidationException)
            res.status(error.status).jsend.fail(error.message);
        else if (error instanceof ConflictException)
            res.status(error.status).jsend.fail(error.message);
        else
            res.status(500).jsend.error('Something went wrong');
        winston.error(error);
    };

export default errorMiddleware;
