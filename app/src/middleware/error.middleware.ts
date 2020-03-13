import {NextFunction, Request, Response} from 'express';
import {ConflictException, HttpException, ResourceNotFoundException, ValidationException} from '@exceptions';
import {winston} from '@utils';

const errorMiddleware = () =>
    (error: HttpException, req: Request, res: Response, next: NextFunction) => {
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
