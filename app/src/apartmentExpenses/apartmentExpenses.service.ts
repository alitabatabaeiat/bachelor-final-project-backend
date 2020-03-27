import {getCustomRepository} from 'typeorm';
import _ from 'lodash';
import ApartmentExpense from './apartmentExpenses.entity';
import {
    createApartmentExpenseSchema,
    getAllApartmentExpensesSchema
} from './apartmentExpenses.validation';
import {validate, catchExceptions} from '@utils';
import ApartmentExpenseRepository from './apartmentExpenses.repository';
import {ObjectLiteral, User} from "@interfaces";
import {ExpenseTypeService} from "@expenseTypes";
import {ApartmentService} from "@apartments";
import {SplitOption, FilterOption} from '@constants';

const createApartmentExpense = async (user: User, data: ObjectLiteral): Promise<ApartmentExpense> | never => {
    try {
        const validData = validate(createApartmentExpenseSchema, data);
        const repository = getCustomRepository(ApartmentExpenseRepository);
        await ExpenseTypeService.getExpenseType(user, {id: validData.type});
        await ApartmentService.getApartment(user, {id: validData.apartment});
        let apartmentExpense = repository.create(validData);
        await repository.insert(apartmentExpense);
        apartmentExpense = _.assign(apartmentExpense, {
            splitOption: SplitOption[apartmentExpense.splitOption],
            filterOption: FilterOption[apartmentExpense.filterOption]
        });
        return _.pick(apartmentExpense, ['id', 'amount', 'description', 'filterOption', 'splitOption']) as ApartmentExpense;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const getAllApartmentExpenses = async (user: User, data: ObjectLiteral): Promise<ApartmentExpense[]> | never => {
    try {
        const validData = validate(getAllApartmentExpensesSchema, data);
        const repository = getCustomRepository(ApartmentExpenseRepository);
        let apartmentExpenses = await repository.find({
            where: {
                apartment: validData.apartment
            }
        });
        apartmentExpenses = apartmentExpenses.map(expense => _.assign(expense, {
            splitOption: SplitOption[expense.splitOption],
            filterOption: FilterOption[expense.filterOption]
        }));
        return apartmentExpenses;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const getOptions = (user: User, data: ObjectLiteral): ObjectLiteral => {
    return {
        splitOptions: Object.values(SplitOption),
        filterOptions: Object.values(FilterOption)
    };
};

const service = {
    createApartmentExpense,
    getAllApartmentExpenses,
    getOptions
};

export default service;
