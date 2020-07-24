import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import {Rules} from "@utils";

const ExtendedJoi = Joi.extend(JoiDate);

export const createNotificationSchema = Joi.object({
    title: Rules.persianText.min(3).max(30).required(),
    body: Rules.persianText.required(),
    apartment: Rules.id.required()
});

export const getAllNotificationsSchema = Joi.object({
    apartment: Rules.id.required()
});
//
// export const getNotificationSchema = Joi.object({
//     apartment: Rules.id.required(),
//     id: Rules.id.required()
// });
