declare namespace Express {
    interface ObjectLiteral {
        [key: string]: any;
    }

    interface User {
        id: number
    }

    export interface Request {
        user?: User;
        apartment?: ObjectLiteral;
    }
}
