import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from '@utils';

const ExtendedJoi = Joi.extend(JoiDate);

const createUserSchema = Joi.object({
    firstName: Rules.persianLetterWithSpace.min(3).max(20).required(),
    lastName:  Rules.persianLetterWithSpace.min(3).max(20).required(),
    mobileNumber: Rules.mobileNumber.required(),
    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).min(3).required()
});

const createTempUserSchema = Joi.object({
    mobileNumber: Rules.mobileNumber.length(10).required(),
});

const getUserSchema = Joi.object({
    id: Rules.id,
    mobileNumber: Rules.mobileNumber
}).xor('id', 'mobileNumber');

export {
    createUserSchema,
    createTempUserSchema,
    getUserSchema
}
