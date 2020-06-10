import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from "@utils";

const ExtendedJoi = Joi.extend(JoiDate);

export const createChargeSchema = Joi.object({
    title: Rules.persianText.min(3).max(30).required(),
    paymentDeadline: Joi.number().integer().positive(),
    delayPenalty: Joi.number().integer().positive(),
    includeFixedCharge: Joi.boolean().required(),
    expenses: Joi.array().items(Rules.id).default([]),
    apartment: Rules.id.required()
});
