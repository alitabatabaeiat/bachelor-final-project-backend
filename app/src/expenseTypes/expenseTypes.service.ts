import {getCustomRepository} from 'typeorm';
import _ from 'lodash';
import ExpenseType from './expenseTypes.entity';
import {
    createExpenseTypeSchema
} from './expenseTypes.validation';
import {validate, catchExceptions} from '@utils';
import ExpenseTypeRepository from './expenseTypes.repository';
import {ObjectLiteral, User} from "@interfaces";

const createExpenseType = async (user: User, data: ObjectLiteral): Promise<ExpenseType> | never => {
    try {
        const validData = validate(createExpenseTypeSchema, data);
        const repository = getCustomRepository(ExpenseTypeRepository);
        const expenseType = repository.create(_.assign(validData, {owner: user}));
        await repository.insert(expenseType);
        return _.pick(expenseType, ['id', 'title', 'color']) as ExpenseType;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const service = {
    createExpenseType
};

export default service;
