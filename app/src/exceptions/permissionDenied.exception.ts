import HttpException from "./http.exception";

class PermissionDeniedException extends HttpException {
    constructor(message: string) {
        super(403, message);
        this.name = 'PermissionDeniedException';
    }
}

export default PermissionDeniedException;
