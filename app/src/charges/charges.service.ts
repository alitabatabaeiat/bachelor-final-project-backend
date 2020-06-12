import _ from 'lodash';
import Charge from './charges.entity';
import {
    createChargeSchema
} from './charges.validation';
import {validate, catchExceptions} from '@utils';
import getChargeRepository from './charges.repository';
import {ObjectLiteral, User} from "@interfaces";
import {ApartmentService} from '@apartments';
import {Transactional} from "typeorm-transactional-cls-hooked";
import {getApartmentExpenseRepository} from "@apartmentExpenses";
import {getUnitChargeRepository} from "@unitCharges";

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
            const unitExpenses: ObjectLiteral = _.groupBy(_.flatten(apartmentExpenses.map(aptExp => aptExp.unitExpenses)), 'unitId');

            const charge = getChargeRepository().create(_.pick(validData,
                ['title', 'paymentDeadline', 'delayPenalty', 'includeFixedCharge', 'apartment'])
            );
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
            return _.assign(charge, {
                unitCharges,
                expenses: apartmentExpenses.map(aptExp => _.omit(aptExp, ['unitExpenses', 'isDeclared'])),
            });
        } catch (ex) {
            catchExceptions(ex);
        }
    };
}

export default new ChargeService();
