import {ValidationException} from "@exceptions";
import {Schema} from "@hapi/joi";
import {ObjectLiteral} from "@interfaces";

const validate = (schema: Schema, data: ObjectLiteral): ObjectLiteral | never => {
    const {error, value} = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error)
        throw new ValidationException(error.details);
    return value;
};

export default validate;
