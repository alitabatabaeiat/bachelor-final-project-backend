import {Request, Response, NextFunction, RequestHandler} from "express";
import winston from './winston';
import {HttpException} from '@exceptions';
import {ObjectLiteral} from "@interfaces";
import _ from "lodash";

const asyncWrapper = (handler: Function): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await handler(req, res, next);
        } catch (ex) {
            next(ex)
        }
    }
};

const catchExceptions = (ex: Error, catchAdditionalExceptions?: Function): never => {
    winston.error(ex);
    if (catchAdditionalExceptions)
        catchAdditionalExceptions(ex);
    if (ex instanceof HttpException)
        throw ex;
    throw new HttpException();
};

const renameKey = (obj: ObjectLiteral, oldKey: string, newKey: string) => {
    if (_.has(obj, oldKey)) {
        _.set(obj, newKey, _.get(obj, oldKey));
        _.unset(obj, oldKey);
    }
    return obj
};

export {
    asyncWrapper,
    catchExceptions,
    renameKey
}
