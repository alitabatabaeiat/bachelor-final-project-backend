import {NextFunction, Request, Response} from 'express';
import {ResourceNotFoundException} from "@exceptions";

const notFoundMiddleware = () =>
    (req: Request, res: Response, next: NextFunction) =>
        next(new ResourceNotFoundException('404 Not Found'));

export default notFoundMiddleware;
