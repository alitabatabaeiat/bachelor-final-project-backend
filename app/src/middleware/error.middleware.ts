import {NextFunction, Request, Response} from 'express';
import {HttpException} from '@exceptions';
import {winston} from '@utils';

const errorMiddleware = () =>
    (error: HttpException, request: Request, response: Response, next: NextFunction) => {
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';
        const errors = error.errors;
        response.status(status)
            .send({
                status,
                message,
                errors
            });
        winston.error(error);
    };

export default errorMiddleware;
