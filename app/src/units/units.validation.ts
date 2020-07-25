import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from "@utils";

const ExtendedJoi = Joi.extend(JoiDate);

export const createUnitSchema = Joi.object({
    title: Rules.persianText.min(3).max(25).required(),
    floor: Joi.number().integer().required(),
    area: Joi.number().integer().positive().required(),
    parkingSpaceCount: Joi.number().integer().min(0).required(),
    residentCount: Joi.number().integer().min(0),
    fixedCharge: Joi.number().integer().min(0),
    powerConsumption: Joi.number().integer().min(0),
    suggestedConsumptionCoefficient: Joi.number().min(0),
    isEmpty: Joi.boolean().falsy(1).truthy(0).required(),
    apartment: Rules.id.required(),
    resident: Rules.mobileNumber
});

export const createMultipleUnitsSchema = Joi.object({
    apartment: Rules.id.required(),
    file: Joi.binary().required(),
    fileType: Joi.string().valid('xlsx').required()
});

export const getResidentUnitsSchema = Joi.object({
});

export const getApartmentUnitsSchema = Joi.object({
    apartment: Rules.id.required(),
    isEmpty: Joi.boolean()
});

export const getUnitAsResidentSchema = Joi.object({
    id: Rules.id.required()
});

export const getUnitAsManagerSchema = Joi.object({
    id: Rules.id.required()
});

export const getUnitsCountSchema = Joi.object({
    apartment: Rules.id.required()
});

export const updateUnitSchema = Joi.object({
    id: Rules.id.required(),
    title: Rules.persianText.min(3).max(25),
    floor: Joi.number().integer(),
    area: Joi.number().integer().positive(),
    parkingSpaceCount: Joi.number().integer().min(0),
    residentCount: Joi.number().integer().min(0),
    fixedCharge: Joi.number().integer().min(0),
    powerConsumption: Joi.number().integer().min(1),
    suggestedConsumptionCoefficient: Joi.number().greater(0).allow(null),
    isEmpty: Joi.boolean(),
    resident: Rules.mobileNumber.allow(null)
});

export const deleteUnitSchema = Joi.object({
    id: Rules.id.required()
});
