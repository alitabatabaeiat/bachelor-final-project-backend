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
    apartmentId: Joi.number().integer().greater(0).required()
});

const getUnitSchema = Joi.object({
    id: Joi.number().integer().greater(0),
    apartmentId: Joi.number().integer().greater(0)
});

export {
    createUnitSchema,
    getUnitSchema
}
