import Joi from "@hapi/joi";
import persianRex from 'persian-rex';

const id = Joi.number().integer().greater(0);

const mobileNumber = Joi.string().pattern(/^9\d{9}$/, {name: 'mobileNumber'})
    .length(10);

const persianText = Joi.string().pattern(persianRex.text, {name: 'persianText'});

const persianLetter = Joi.string().pattern(persianRex.letter, { name: 'persianLetter'});

const persianLetterWithSpace = Joi.string()
    .pattern(new RegExp('^(' + persianRex.lettersASCIRange + ')|(\s)+$'), { name: 'persianLetterWithSpace'});

export default {
    id,
    mobileNumber,
    persianText,
    persianLetter,
    persianLetterWithSpace
}
