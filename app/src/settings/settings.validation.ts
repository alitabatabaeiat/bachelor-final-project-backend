import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from "@utils";
import {Column} from "typeorm";

const ExtendedJoi = Joi.extend(JoiDate);

export const updateApartmentSettingSchema = Joi.object({
    residentCountStep: Joi.number().positive(),
    parkingSpaceCountStep: Joi.number().positive(),
    floorStep: Joi.number().positive(),
    areaStep: Joi.number().positive(),
    apartment: Rules.id.required()
});

export const getApartmentSettingSchema = Joi.object({
    apartment: Rules.id.required()
});
