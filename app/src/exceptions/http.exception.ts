class HttpException extends Error {
    public status: number;
    public errors?: any;

    constructor(status?: number, message?: string, errors?: any) {
        super(message ?? 'Something went wrong');
        this.name = 'HttpException';
        this.status = status ?? 500;
        this.errors = errors;
    }
}

export default HttpException;
