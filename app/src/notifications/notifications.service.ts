import _ from 'lodash';
import {
    createNotificationSchema, getAllNotificationsSchema
} from './notifications.validation';
import {validate, catchExceptions} from '@utils';
import {ObjectLiteral, User} from "@interfaces";
import {ApartmentService} from '@apartments';
import {Transactional} from "typeorm-transactional-cls-hooked";
import getNotificationRepository from "./notifications.repository";
import AppNotification from "./notifications.entity";

class ChargeService {

    @Transactional()
    async createNotification(user: User, data: ObjectLiteral): Promise<AppNotification> | never {
        try {
            let validData = validate(createNotificationSchema, data);
            await ApartmentService.getApartment(user, {id: validData.apartment});
            const notification = getNotificationRepository().create(_.assign(validData, {
                sender: user.id
            }));
            await getNotificationRepository().insert(notification);
            return notification;
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getAllNotifications(user: User, data: ObjectLiteral): Promise<AppNotification[]> | never {
        try {
            const validData = validate(getAllNotificationsSchema, data);
            await ApartmentService.getApartment(user, {id: validData.apartment});
            const notifications = await getNotificationRepository().find({
                where: {apartment: validData.apartment}
            });
            return notifications;
        } catch (e) {
            catchExceptions(e);
        }
    }

    // async getNotification(user: User, data: ObjectLiteral): Promise<AppNotification> | never {
    //     try {
    //         const validData = validate(getNotificationSchema, data);
    //         await ApartmentService.getApartment(user, {id: validData.apartment});
    //         return null;
    //     } catch (e) {
    //         catchExceptions(e);
    //     }
    // }
}

export default new ChargeService();
