import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from '@utils';

const ExtendedJoi = Joi.extend(JoiDate);

const createApartmentSchema = Joi.object({
    title: Rules.persianText.min(3).max(25).required(),
    city: Rules.persianLetterWithSpace.min(3).max(20).required(),
    address: Rules.persianText.min(3).max(100).required(),
});

const getAllApartmentsSchema = Joi.object({
});

const getApartmentSchema = Joi.object({
    id: Rules.id.required()
});

const updateApartmentSchema = Joi.object({
    id: Rules.id.required(),
    title: Rules.persianText.min(3).max(25),
    city: Rules.persianLetterWithSpace.min(3).max(20),
    address: Rules.persianText.min(3).max(100),
});

const deleteApartmentSchema = Joi.object({
    id: Rules.id.required()
});

export {
    createApartmentSchema,
    getAllApartmentsSchema,
    getApartmentSchema,
    updateApartmentSchema,
    deleteApartmentSchema
}
