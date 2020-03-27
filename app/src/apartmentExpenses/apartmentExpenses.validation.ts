import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from '@utils';
import {SplitOption, FilterOption} from "@constants";

const ExtendedJoi = Joi.extend(JoiDate);

const createApartmentExpenseSchema = Joi.object({
    apartment: Rules.id.required(),
    type: Rules.id.required(),
    amount: Joi.number().integer().min(0).required(),
    description: Rules.persianText.max(256),
    splitOption: Joi.string().valid(...Object.keys(SplitOption)).required(),
    filterOption: Joi.string().valid(...Object.keys(FilterOption)).required()
});

const getAllApartmentExpensesSchema = Joi.object({
    apartment: Rules.id.required()
});

export {
    createApartmentExpenseSchema,
    getAllApartmentExpensesSchema
}
