import {Request, Response, NextFunction} from "express"

const authenticationMiddleware = () =>
    (req: Request, res: Response, next: NextFunction): void => {
        req.user = {id: 1};
        next()
    };

export default authenticationMiddleware;
