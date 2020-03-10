import HttpException from "./http.exception";

class ConflictException extends HttpException {
    constructor(message: string) {
        super(409, message);
        this.name = 'ConflictException';
    }
}

export default ConflictException;