import _ from 'lodash';
import UnitExpense from './unitExpenses.entity';
import {
    createUnitExpenseSchema, getAllExpensesSchema
} from './unitExpenses.validation';
import {validate, catchExceptions} from '@utils';
import getUnitExpenseRepository from './unitExpenses.repository';
import {ObjectLiteral, User} from "@interfaces";
import {Transactional} from "typeorm-transactional-cls-hooked";

class UnitExpenseService {

    @Transactional()
    async createUnitExpense(user: User, data: ObjectLiteral): Promise<UnitExpense> | never {
        try {
            const validData = validate(createUnitExpenseSchema, data);
            let unitExpense = getUnitExpenseRepository().create(validData);
            await getUnitExpenseRepository().insert(unitExpense);
            return _.pick(unitExpense, ['id', 'amount', 'unit']) as UnitExpense;
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getAllExpenses(user: User, data: ObjectLiteral): Promise<UnitExpense[]> | never {
        try {
            const validData = validate(getAllExpensesSchema, data);
            let unitExpenses = getUnitExpenseRepository().find({
                where: {
                    unit: validData.unit
                },
                relations: ['apartmentExpense']
            });
            return unitExpenses;
        } catch (ex) {
            catchExceptions(ex);
        }
    };


}

export default new UnitExpenseService();
