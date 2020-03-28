import {getCustomRepository} from 'typeorm';
import _ from 'lodash';
import UnitExpense from './unitExpenses.entity';
import {
    createUnitExpenseSchema
} from './unitExpenses.validation';
import {validate, catchExceptions} from '@utils';
import UnitExpenseRepository from './unitExpenses.repository';
import {ObjectLiteral, User} from "@interfaces";
import {UnitService} from "@units";

const createUnitExpense = async (user: User, data: ObjectLiteral): Promise<UnitExpense> | never => {
    try {
        const validData = validate(createUnitExpenseSchema, data);
        const repository = getCustomRepository(UnitExpenseRepository);
        await UnitService.getUnitAsManager(user, {id: validData.unit});
        let unitExpense = repository.create(validData);
        await repository.insert(unitExpense);
        return _.pick(unitExpense, ['id', 'amount']) as UnitExpense;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const service = {
    createUnitExpense
};

export default service;
