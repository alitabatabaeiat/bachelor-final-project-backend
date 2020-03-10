import HttpException from "./http.exception";

class ValidationException extends HttpException {
    constructor(errors) {
        super(400, 'Validation error', errors);
        this.name = 'ValidationException';
    }
}

export default ValidationException;
