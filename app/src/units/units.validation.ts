import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import persianRex from 'persian-rex';

const ExtendedJoi = Joi.extend(JoiDate);

const createUnitSchema = Joi.object({
    title: Joi.string().pattern(persianRex.text, {name: 'persianText'}).min(3).max(25).required(),
    floor: Joi.number().integer().required(),
    area: Joi.number().integer().positive().required(),
    parkingSpaceCount: Joi.number().integer().min(0).required(),
    residentCount: Joi.number().integer().min(0).required(),
    fixedCharge: Joi.number().integer().min(0),
    isEmpty: Joi.boolean().required(),
    apartment: Joi.number().integer().greater(0).required()
});

const getResidentUnitsSchema = Joi.object({
});

const getApartmentUnitsSchema = Joi.object({
    apartment: Joi.number().integer().greater(0).required()
});

const getUnitAsResidentSchema = Joi.object({
    id: Joi.number().integer().greater(0).required()
});

const getUnitAsManagerSchema = Joi.object({
    id: Joi.number().integer().greater(0).required()
});

const updateUnitSchema = Joi.object({
    id: Joi.number().integer().greater(0).required(),
    title: Joi.string().pattern(persianRex.text, {name: 'persianText'}).min(3).max(25),
    floor: Joi.number().integer(),
    area: Joi.number().integer().positive(),
    parkingSpaceCount: Joi.number().integer().min(0),
    residentCount: Joi.number().integer().min(0),
    fixedCharge: Joi.number().integer().min(0),
    isEmpty: Joi.boolean()
});

const deleteUnitSchema = Joi.object({
    id: Joi.number().integer().greater(0).required()
});

export {
    createUnitSchema,
    getResidentUnitsSchema,
    getApartmentUnitsSchema,
    getUnitAsResidentSchema,
    getUnitAsManagerSchema,
    updateUnitSchema,
    deleteUnitSchema
}
