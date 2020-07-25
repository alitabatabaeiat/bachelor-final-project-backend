import HttpException from "./http.exception";

class UnAuthorizedException extends HttpException {
    constructor(message: string) {
        super(401, message);
        this.name = 'UnAuthorizedException'
    }
}

export default UnAuthorizedException;
