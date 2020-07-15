import _ from 'lodash';
import Charge from './charges.entity';
import {
    createChargeSchema, getAllChargesSchema, getChargeSchema
} from './charges.validation';
import {validate, catchExceptions} from '@utils';
import getChargeRepository from './charges.repository';
import {ObjectLiteral, User} from "@interfaces";
import {ApartmentService} from '@apartments';
import {Transactional} from "typeorm-transactional-cls-hooked";
import {getApartmentExpenseRepository} from "@apartmentExpenses";
import {getUnitChargeRepository, UnitChargeService} from "@unitCharges";
import getUnitExpenseRepository from "../unitExpenses/unitExpenses.repository";

class ChargeService {

    @Transactional()
    async createCharge(user: User, data: ObjectLiteral): Promise<Charge> | never {
        try {
            let validData = validate(createChargeSchema, data);
            let {units} = await ApartmentService.getApartment(user, {id: validData.apartment}, true);
            let apartmentExpenses = await getApartmentExpenseRepository().findByIds(validData.expenses, {
                apartment: validData.apartment,
                isDeclared: false
            });
            const totalChargeAmount = _.sumBy(apartmentExpenses, 'amount');
            const unitExpenses: ObjectLiteral = _.groupBy(_.flatten(apartmentExpenses.map(aptExp => aptExp.unitExpenses)), 'unitId');

            const charge = getChargeRepository().create({
                totalAmount: totalChargeAmount,
                ..._.pick(validData,
                    ['title', 'paymentDeadline', 'delayPenalty', 'includeFixedCharge', 'description', 'apartment'])
            });
            await getChargeRepository().insert(charge);
            if (apartmentExpenses.length > 0)
                await getApartmentExpenseRepository().update(apartmentExpenses.map(aptExp => aptExp.id),
                    {isDeclared: true, charge}
                );
            const unitCharges: any[] = units.map(unit => {
                let chargeAmount = 0;
                if (unitExpenses[unit.id])
                    chargeAmount += unitExpenses[unit.id].reduce((pVal, cVal) => pVal + cVal.amount, 0);
                chargeAmount += (validData.includeFixedCharge ? unit.fixedCharge : 0);
                return {
                    amount: chargeAmount,
                    unit,
                    charge: charge.id
                };
            });
            await getUnitChargeRepository().insert(unitCharges);
            // if (apartmentExpenses.length > 0)
            //     await Promise.all(apartmentExpenses.map(async aptExp => {
            //         await
            //         await getUnitExpenseRepository().update({apartmentExpense: aptExp.id},
            //             {unitCharge: unitCharges.find(c => ap)})
            //     }));
            return _.assign(charge, {
                unitCharges,
                expenses: apartmentExpenses.map(aptExp => _.omit(aptExp, ['unitExpenses', 'isDeclared'])),
            });
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getAllCharges(user: User, data: ObjectLiteral): Promise<Charge[]> | never {
        try {
            const validData = validate(getAllChargesSchema, data);
            await ApartmentService.getApartment(user, {id: validData.apartment});
            const charges = await getChargeRepository().find({
                where: {apartment: validData.apartment},
                relations: ['unitCharges']
            });
            return charges;
        } catch (e) {
            catchExceptions(e);
        }
    }

    async getCharge(user: User, data: ObjectLiteral): Promise<Charge> | never {
        try {
            const validData = validate(getChargeSchema, data);
            await ApartmentService.getApartment(user, {id: validData.apartment});
            const charge = await getChargeRepository().findOne({
                where: {
                    id: validData.id,
                    apartment: validData.apartment
                },
                relations: ['unitCharges']
            });
            charge.unitCharges = await Promise.all(charge.unitCharges.map(async uCharge =>
                await UnitChargeService.getCharge(user, {
                    id: uCharge.id
                })
            ));
            return charge;
        } catch (e) {
            catchExceptions(e);
        }
    }
}

export default new ChargeService();
