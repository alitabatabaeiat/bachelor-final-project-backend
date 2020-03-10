import {ValidationException} from "@exceptions";
import {Schema} from "@hapi/joi";

const validate = (schema: Schema, data) => {
    const {error, value} = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error)
        throw new ValidationException(error.details);
    return value;
};

export default validate;
