import _ from 'lodash';
import {
    updateApartmentSettingSchema, getApartmentSettingSchema
} from './settings.validation';
import {validate, catchExceptions} from '@utils';
import {ObjectLiteral, User} from "@interfaces";
import {ApartmentService} from '@apartments';
import {Transactional} from "typeorm-transactional-cls-hooked";
import getSettingRepository from "./settings.repository";
import Setting from "./settings.entity";

class SettingService {

    @Transactional()
    async updateApartmentSetting(user: User, data: ObjectLiteral): Promise<Setting> | never {
        try {
            let validData = validate(updateApartmentSettingSchema, data);
            await ApartmentService.getApartment(user, {id: validData.apartment});
            await getSettingRepository().update({apartment: validData.apartment}, _.omit(validData, 'apartment'));
            return await getSettingRepository().findOne({apartment: validData.apartment});
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getApartmentSetting(user: User, data: ObjectLiteral): Promise<Setting> | never {
        try {
            const validData = validate(getApartmentSettingSchema, data);
            await ApartmentService.getApartment(user, {id: validData.apartment});
            const setting = await getSettingRepository().findOne({apartment: validData.apartment});
            return setting;
        } catch (e) {
            catchExceptions(e);
        }
    }
}

export default new SettingService();
