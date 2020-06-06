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
    splitOption: Joi.number().integer().valid(...Object.keys(SplitOption).map(Number)).required(),
    filterOption: Joi.number().integer().valid(...Object.keys(FilterOption).map(Number)).required()
})
    .when(Joi.object({splitOption: 6}).unknown(), {
        then: Joi.object({
            units: Joi.array().items(Joi.number().integer().greater(0)).min(1).required(),
            coefficients: Joi.array().items(Joi.number().integer().greater(0)).required()
        }).assert('.units.length', Joi.ref('coefficients.length'))
    })
    .when(Joi.object({filterOption: 4}).unknown(), {
        then: Joi.object({
            units: Joi.array().items(Joi.number().integer().greater(0)).min(1).required(),
        })
    });

const getAllApartmentExpensesSchema = Joi.object({
    apartment: Rules.id.required(),
    declared: Joi.boolean()
});

export {
    createApartmentExpenseSchema,
    getAllApartmentExpensesSchema
}
