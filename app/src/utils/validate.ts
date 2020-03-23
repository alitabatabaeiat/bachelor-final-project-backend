import {ValidationException} from "@exceptions";
import {Schema} from "@hapi/joi";
import {ObjectLiteral} from "@interfaces";
import _ from "lodash";

const messages = {
    'any.default': '{{#label}} در اجرای متد پیشفرض خطایی رخ داد',
    'any.invalid': '{{#label}} مقدار نادرستی دارد',
    'any.only': '{{#label}} باید {if(#valids.length == 1, "", "یکی از مقادیر")}{{#valids}} باشد',
    'any.ref': '{{#label}} {{#arg}} references "{{#ref}}" which {{#reason}}',
    'any.required': '{{#label}} اجباری است',
    'any.unknown': '{{#label}} مجاز نیست',

    'array.base': '{{#label}} باید آرایه باشد',
    'array.excludes': '{{#label}} شامل مقدار نامعتبری است',
    'array.length': '{{#label}} باید شامل {{#limit}} مقدار باشد',
    'array.max': '{{#label}} باید شامل کوچکتر یا مساوی {{#limit}} مقدار باشد',
    'array.min': '{{#label}} باید حداقل شامل {{#limit}} مقدار باشد',
    'array.unique': '{{#label}} شامل مقدار تکراری است',

    'boolean.base': '{{#label}} باید مقدار boolean باشد',

    'date.base': '{{#label}} باید تاریخ معتبر باشد',
    'date.format': '{{#label}} باید به فرمت {msg("date.format." + #format) || #format} باشد',
    'date.greater': '{{#label}} باید بزرگتر از "{{#limit}}" باشد',
    'date.less': '{{#label}} باید کوچکتر از "{{#limit}}" باشد',
    'date.max': '{{#label}} باید کوچکتر یا مساوی "{{#limit}}" باشد',
    'date.min': '{{#label}} باید بزرگتر یا مساوی "{{#limit}}" باشد',

    // Messages used in date.format

    'date.format.iso': 'ISO 8601',
    'date.format.javascript': 'timestamp یا تعداد میلی ثانیه',
    'date.format.unix': 'timestamp یا تعداد ثانیه',

    'object.and': '{{#label}} contains {{#presentWithLabels}} without its required peers {{#missingWithLabels}}',
    'object.assert': '{{#label}} is invalid because {if(#subject.key, `"` + #subject.key + `" failed to ` + (#message || "pass the assertion test"), #message || "the assertion failed")}',
    'object.base': '{{#label}} must be of type {{#type}}',
    'object.instance': '{{#label}} must be an instance of "{{#type}}"',
    'object.length': '{{#label}} must have {{#limit}} key{if(#limit == 1, "", "s")}',
    'object.max': '{{#label}} must have less than or equal to {{#limit}} key{if(#limit == 1, "", "s")}',
    'object.min': '{{#label}} must have at least {{#limit}} key{if(#limit == 1, "", "s")}',
    'object.missing': '{{#label}} must contain at least one of {{#peersWithLabels}}',
    'object.nand': '"{{#mainWithLabel}}" must not exist simultaneously with {{#peersWithLabels}}',
    'object.oxor': '{{#label}} contains a conflict between optional exclusive peers {{#peersWithLabels}}',
    'object.pattern.match': '{{#label}} keys failed to match pattern requirements',
    'object.refType': '{{#label}} must be a Joi reference',
    'object.regex': '{{#label}} must be a RegExp object',
    'object.rename.multiple': '{{#label}} cannot rename "{{#from}}" because multiple renames are disabled and another key was already renamed to "{{#to}}"',
    'object.rename.override': '{{#label}} cannot rename "{{#from}}" because override is disabled and target "{{#to}}" exists',
    'object.schema': '{{#label}} must be a Joi schema of {{#type}} type',
    'object.unknown': '{{#label}} is not allowed',
    'object.with': '"{{#mainWithLabel}}" missing required peer "{{#peerWithLabel}}"',
    'object.without': '"{{#mainWithLabel}}" conflict with forbidden peer "{{#peerWithLabel}}"',
    'object.xor': '{{#label}} contains a conflict between exclusive peers {{#peersWithLabels}}',

    'number.base': '{{#label}} باید عدد باشد',
    'number.greater': '{{#label}} باید بزرگتر از {{#limit}} باشد',
    'number.infinity': '{{#label}} نمی‌تواند بی‌نهایت باشد',
    'number.integer': '{{#label}} باید از نوع integer باشد',
    'number.less': '{{#label}} باید کوچکتر از {{#limit}} باشد',
    'number.max': '{{#label}} باید کوچکتر یا مساوی {{#limit}} باشد',
    'number.min': '{{#label}} باید بزرکتر یا مساوی {{#limit}} باشد',
    'number.multiple': '{{#label}} باید ضریبی از {{#multiple}} باشد',
    'number.negative': '{{#label}} باید منفی باشد',
    'number.port': '{{#label}} باید پورت معتبر باشد',
    'number.positive': '{{#label}} باید مثبت باشد',
    'number.precision': '{{#label}} نباید بیشتر از {{#limit}} رقم اعشار داشته باشد',
    'number.unsafe': '{{#label}} باید عددی safe باشد',

    'string.alphanum': '{{#label}} باید فقط شامل کاراکترهای alpha-numeric باشد',
    'string.base': '{{#label}} باید یک رشته باشد',
    'string.base64': '{{#label}} باید یک رشته‌ی base64 معتبر باشد',
    'string.domain': '{{#label}} باید شامل رشته دامین معتبر باشد',
    'string.email': '{{#label}} باید ایمیل معتبر باشد',
    'string.empty': '{{#label}} مجاز نیست خالی باشد',
    'string.guid': '{{#label}} باید GUID معتبر باشد',
    'string.hex': '{{#label}} باید فقط شامل کاراکترهای هگزادسیمال باشد',
    'string.hostname': '{{#label}} باید hostname معتبر باشد',
    'string.isoDate': '{{#label}} باید در فرمت iso باشد',
    'string.length': '{{#label}} طول رشته باید {{#limit}} کاراکتر باشد',
    'string.max': '{{#label}} طول رشته باید کوچکتر یا مساوی {{#limit}} کاراکتر باشد',
    'string.min': '{{#label}} طول رشته باید حداقل {{#limit}} کاراکتر باشد',
    'string.pattern.base': '{{#label}} مقدار "{[.]}" با الگوی داده شده مطابق نیست: {{#regex}}',
    'string.pattern.name': '{{#label}} مقدار "{[.]}" با الگوی {{#name}} مطابق نیست',
};

const validate = (schema: Schema, data: ObjectLiteral): ObjectLiteral | never => {
    const {error, value} = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        errors: {
            label: false
        },
        messages
    });

    if (error) {
        const errors = {};
        error.details.forEach(detail => errors[detail.path[0]] = _.pick(detail, ['type', 'message']));
        throw new ValidationException(errors);
    }

    return value;
};

export default validate;
