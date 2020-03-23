import {getCustomRepository} from 'typeorm';
import _ from 'lodash';
import ExpenseType from './expenseTypes.entity';
import {
    createExpenseTypeSchema,
    getAllExpenseTypesSchema,
    getExpenseTypeSchema
} from './expenseTypes.validation';
import {validate, catchExceptions} from '@utils';
import ExpenseTypeRepository from './expenseTypes.repository';
import {ObjectLiteral, User} from "@interfaces";
import ResourceNotFoundException from "../exceptions/resourceNotFound.execption";

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

const getAllExpenseTypes = async (user: User, data: ObjectLiteral): Promise<ExpenseType[]> | never => {
    try {
        const validData = validate(getAllExpenseTypesSchema, data);
        const repository = getCustomRepository(ExpenseTypeRepository);
        const expenseTypes = await repository.find({
            where: {
                owner: user.id
            }
        });
        return expenseTypes;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const getExpenseType = async (user: User, data: ObjectLiteral): Promise<ExpenseType> | never => {
    try {
        const validData = validate(getExpenseTypeSchema, data);
        const repository = getCustomRepository(ExpenseTypeRepository);
        const expenseType = await repository.findOne({
            where: {
                id: validData.id,
                owner: user.id
            }
        });
        if (!expenseType)
            throw new ResourceNotFoundException('ExpenseType not found');
        return expenseType;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const service = {
    createExpenseType,
    getAllExpenseTypes,
    getExpenseType
};

export default service;
