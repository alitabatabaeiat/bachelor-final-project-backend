import _ from 'lodash';
import UnitCharge from './unitCharges.entity';
import {
    getAllChargesSchema, getChargeSchema
} from './unitCharges.validation';
import {validate, catchExceptions} from '@utils';
import getUnitChargeRepository from './unitCharges.repository';
import {ObjectLiteral, User} from "@interfaces";
import getUnitRepository from "../units/units.repository";
import {FilterOption, SplitOption} from "@constants";

class UnitChargeService {

    async getAllCharges(user: User, data: ObjectLiteral): Promise<UnitCharge[]> | never {
        try {
            const validData = validate(getAllChargesSchema, data);
            await getUnitRepository().findOne({id: validData.unit});

            const charges = await getUnitChargeRepository().createQueryBuilder('uCharge')
                .leftJoinAndSelect('uCharge.unit', 'unit')
                .leftJoinAndSelect('uCharge.charge', 'charge')
                .leftJoinAndSelect('charge.expenses', 'aptExp')
                .leftJoinAndSelect('aptExp.type', 'aptExpType')
                .innerJoinAndSelect('aptExp.unitExpenses', 'unitExp', 'unitExp.unit = :unit')
                .where('uCharge.unit = :unit')
                .setParameter('unit', validData.unit)
                .getMany();
            charges.forEach(charge => {
                charge.charge.expenses.forEach(expense => {
                    expense.splitOption = SplitOption[expense.splitOption];
                    expense.filterOption = FilterOption[expense.filterOption];
                })
            });
            return charges;
        } catch (e) {
            catchExceptions(e);
        }
    }

    async getCharge(user: User, data: ObjectLiteral): Promise<UnitCharge> | never {
        try {
            const validData = validate(getChargeSchema, data);
            console.log(validData, data)
            const charge = await getUnitChargeRepository().createQueryBuilder('uCharge')
                .leftJoinAndSelect('uCharge.unit', 'unit')
                .leftJoinAndSelect('uCharge.charge', 'charge')
                .leftJoinAndSelect('charge.expenses', 'aptExp')
                .leftJoinAndSelect('aptExp.type', 'aptExpType')
                .innerJoinAndSelect('aptExp.unitExpenses', 'unitExp', 'unitExp.unit = uCharge.unit')
                .where('uCharge.id = :id')
                .setParameter('id', validData.id)
                .getOne();
            charge.charge.expenses.forEach(expense => {
                expense.splitOption = SplitOption[expense.splitOption];
                expense.filterOption = FilterOption[expense.filterOption];
            });
            return charge;
        } catch (e) {
            catchExceptions(e);
        }
    }
}

export default new UnitChargeService();
