import _ from 'lodash';
import UnitCharge from './unitCharges.entity';
import {
    getAllChargesSchema
} from './unitCharges.validation';
import {validate, catchExceptions} from '@utils';
import getUnitChargeRepository from './unitCharges.repository';
import {ObjectLiteral, User} from "@interfaces";
import getUnitRepository from "../units/units.repository";

class UnitChargeService {

    async getAllCharges(user: User, data: ObjectLiteral): Promise<UnitCharge[]> | never {
        try {
            const validData = validate(getAllChargesSchema, data);
            await getUnitRepository().findOne({id: validData.unit});
            const charges = await getUnitChargeRepository().find({
                where: {unit: validData.unit},
                relations: ['charge']
            });
            return charges;
        } catch (e) {
            catchExceptions(e);
        }
    }
}

export default new UnitChargeService();
