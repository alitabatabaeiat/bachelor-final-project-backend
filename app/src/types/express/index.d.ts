declare namespace Express {
    interface User {
        id: number
    }

    export interface Request {
        user?: User;
    }
}