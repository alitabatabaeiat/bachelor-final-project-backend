import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from '@utils';

const ExtendedJoi = Joi.extend(JoiDate);

const createUnitExpenseSchema = Joi.object({
    unit: Rules.id.required(),
    apartmentExpense: Rules.id.required(),
    amount: Joi.number().integer().min(0).required()
});

const getAllExpensesSchema = Joi.object({
    unit: Rules.id.required()
});

export {
    createUnitExpenseSchema,
    getAllExpensesSchema
}
