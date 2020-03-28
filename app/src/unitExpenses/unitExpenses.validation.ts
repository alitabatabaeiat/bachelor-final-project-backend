import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from '@utils';
import {SplitOption, FilterOption} from "@constants";

const ExtendedJoi = Joi.extend(JoiDate);

const createUnitExpenseSchema = Joi.object({
    unit: Rules.id.required(),
    apartmentExpense: Rules.id.required(),
    amount: Joi.number().integer().min(0).required(),
});


export {
    createUnitExpenseSchema
}
