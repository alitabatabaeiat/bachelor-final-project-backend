import {Request, Response, NextFunction, RequestHandler} from "express";
import winston from './winston';
import {HttpException} from '@exceptions';

const asyncWrapper = (handler: Function): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await handler(req, res);
        } catch (ex) {
            next(ex)
        }
    }
};

const catchExceptions = (ex: Error, catchAdditionalExceptions?: Function): never => {
    winston.error(ex);
    if (ex instanceof HttpException)
        throw ex;
    if (catchAdditionalExceptions)
        catchAdditionalExceptions(ex);
    throw new HttpException();
};

export {
    asyncWrapper,
    catchExceptions
}
