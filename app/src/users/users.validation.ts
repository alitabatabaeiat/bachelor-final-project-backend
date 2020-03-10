import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import persianRex from 'persian-rex';
const ExtendedJoi = Joi.extend(JoiDate);

const createUserSchema = Joi.object({
    firstName: Joi.string().pattern(persianRex.letter, { name: 'persianLetter'}).min(3).max(20).required(),
    lastName: Joi.string().pattern(persianRex.letter, { name: 'persianLetter' }).min(3).max(20).required(),
    mobileNumber: Joi.string().pattern(/^9\d{9}$/, { name: 'englishNumber' }).length(10).required(),
    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).min(3).required()
});

const createTempUserSchema = Joi.object({
    mobileNumber: Joi.string().pattern(/^9\d{9}$/, { name: 'englishNumber' }).length(10).required(),
});

const getUserSchema = Joi.object({
    id: Joi.number().integer().greater(0),
    mobileNumber: Joi.string().pattern(/^9\d{9}$/, { name: 'englishNumber' }).length(10)
}).xor('id', 'mobileNumber');

export {
    createUserSchema,
    createTempUserSchema,
    getUserSchema
}
