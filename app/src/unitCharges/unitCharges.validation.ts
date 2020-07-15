import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from "@utils";

const ExtendedJoi = Joi.extend(JoiDate);

export const getAllChargesSchema = Joi.object({
    unit: Rules.id.required()
});

export const getChargeSchema = Joi.object({
    // unit: Rules.id.required(),
    id: Rules.id.required()
});
