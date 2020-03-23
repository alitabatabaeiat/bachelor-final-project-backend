import Joi from "@hapi/joi";
import persianRex from 'persian-rex';

const id = Joi.number().integer().greater(0);

const mobileNumber = Joi.string().pattern(/^9\d{9}$/, {name: 'شماره موبایل'})
    .length(10);

const persianText = Joi.string().pattern(persianRex.text, {name: 'متن فارسی'});

const persianLetter = Joi.string().pattern(persianRex.letter, { name: 'حروف فارسی'});

const persianLetterWithSpace = Joi.string()
    .pattern(new RegExp('^(' + persianRex.lettersASCIRange + ')|(\s)+$'), { name: 'حروف فارسی و فاصله'});

const englishNumber = Joi.string().pattern(/^[0-9]+$/, {name: 'اعداد انگلیسی'});

export default {
    id,
    mobileNumber,
    persianText,
    persianLetter,
    persianLetterWithSpace,
    englishNumber
}
