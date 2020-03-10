import HttpException from "./http.exception";

class ResourceNotFoundException extends HttpException {
    constructor(resourceNameOrMessage: string, fieldName?: string, fieldValue?: string) {
        if (fieldName && fieldValue)
            super(404, `${resourceNameOrMessage} with ${fieldName}: '${fieldValue}' not found`);
        else
            super(404, resourceNameOrMessage);
        this.name = 'ResourceNotFoundException'
    }
}

export default ResourceNotFoundException;
