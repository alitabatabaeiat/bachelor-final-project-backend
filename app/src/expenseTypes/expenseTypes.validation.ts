import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from '@utils';

const ExtendedJoi = Joi.extend(JoiDate);

const createExpenseTypeSchema = Joi.object({
    title: Rules.persianText.min(3).max(25).required(),
    color: Joi.string().hex().length(6).required()
});

export {
    createExpenseTypeSchema
}
