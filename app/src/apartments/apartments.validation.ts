import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import persianRex from 'persian-rex';

const ExtendedJoi = Joi.extend(JoiDate);

const createApartmentSchema = Joi.object({
    title: Joi.string().pattern(persianRex.text, {name: 'persianText'}).min(3).max(25).required(),
    city: Joi.string().pattern(persianRex.letter, {name: 'persianLetter'}).min(3).max(20).required(),
    address: Joi.string().pattern(persianRex.text, {name: 'persianText'}).min(3).max(100).required(),
});

const getApartmentSchema = Joi.object({
    id: Joi.number().integer().greater(0)
});

export {
    createApartmentSchema,
    getApartmentSchema
}
