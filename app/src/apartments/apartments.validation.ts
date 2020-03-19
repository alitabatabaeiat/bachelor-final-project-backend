import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import persianRex from 'persian-rex';

const ExtendedJoi = Joi.extend(JoiDate);

const createApartmentSchema = Joi.object({
    title: Joi.string().pattern(persianRex.text, {name: 'persianText'}).min(3).max(25).required(),
    city: Joi.string().pattern(persianRex.letter, {name: 'persianLetter'}).min(3).max(20).required(),
    address: Joi.string().pattern(persianRex.text, {name: 'persianText'}).min(3).max(100).required(),
});

const getAllApartmentsSchema = Joi.object({
});

const getApartmentSchema = Joi.object({
    id: Joi.number().integer().greater(0).required()
});

const updateApartmentSchema = Joi.object({
    id: Joi.number().integer().greater(0).required(),
    title: Joi.string().pattern(persianRex.text, {name: 'persianText'}).min(3).max(25),
    city: Joi.string().pattern(persianRex.letter, {name: 'persianLetter'}).min(3).max(20),
    address: Joi.string().pattern(persianRex.text, {name: 'persianText'}).min(3).max(100),
});

const deleteApartmentSchema = Joi.object({
    id: Joi.number().integer().greater(0).required()
});

export {
    createApartmentSchema,
    getAllApartmentsSchema,
    getApartmentSchema,
    updateApartmentSchema,
    deleteApartmentSchema
}
