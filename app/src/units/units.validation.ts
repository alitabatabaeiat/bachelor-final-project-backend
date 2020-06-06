import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from "@utils";

const ExtendedJoi = Joi.extend(JoiDate);

const createUnitSchema = Joi.object({
    title: Rules.persianText.min(3).max(25).required(),
    floor: Joi.number().integer().required(),
    area: Joi.number().integer().positive().required(),
    parkingSpaceCount: Joi.number().integer().min(0).required(),
    residentCount: Joi.number().integer().min(0).required(),
    fixedCharge: Joi.number().integer().min(0),
    isEmpty: Joi.boolean().required(),
    apartment: Rules.id.required(),
    resident: Rules.mobileNumber
});

const getResidentUnitsSchema = Joi.object({
});

const getApartmentUnitsSchema = Joi.object({
    apartment: Rules.id.required(),
    isEmpty: Joi.boolean()
});

const getUnitAsResidentSchema = Joi.object({
    id: Rules.id.required()
});

const getUnitAsManagerSchema = Joi.object({
    id: Rules.id.required()
});

const updateUnitSchema = Joi.object({
    id: Rules.id.required(),
    title: Rules.persianText.min(3).max(25),
    floor: Joi.number().integer(),
    area: Joi.number().integer().positive(),
    parkingSpaceCount: Joi.number().integer().min(0),
    residentCount: Joi.number().integer().min(0),
    fixedCharge: Joi.number().integer().min(0),
    isEmpty: Joi.boolean(),
    resident: Rules.mobileNumber.allow(null)
});

const deleteUnitSchema = Joi.object({
    id: Rules.id.required()
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
