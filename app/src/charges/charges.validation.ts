import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from "@utils";

const ExtendedJoi = Joi.extend(JoiDate);

export const createChargeSchema = Joi.object({
    title: Rules.persianText.min(3).max(30).required(),
    paymentDeadline: Joi.number().integer().positive(),
    delayPenalty: Joi.number().integer().positive(),
    includeFixedCharge: Joi.boolean().required(),
    description: Rules.persianText,
    expenses: Joi.array().items(Rules.id).default([]),
    apartment: Rules.id.required()
});

export const getAllChargesSchema = Joi.object({
    apartment: Rules.id.required(),
    chargesCount: Joi.number().integer().greater(0)
});

export const getLastChargeSchema = Joi.object({
    apartment: Rules.id.required()
});

export const getChargeSchema = Joi.object({
    apartment: Rules.id.required(),
    id: Rules.id.required()
});
