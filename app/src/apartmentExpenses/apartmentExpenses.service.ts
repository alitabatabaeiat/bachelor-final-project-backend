import {getCustomRepository} from 'typeorm';
import _ from 'lodash';
import ApartmentExpense from './apartmentExpenses.entity';
import {
    createApartmentExpenseSchema,
    getAllApartmentExpensesSchema
} from './apartmentExpenses.validation';
import {validate, catchExceptions} from '@utils';
import {ObjectLiteral, User} from "@interfaces";
import {ExpenseTypeService} from "@expenseTypes";
import {SplitOption, FilterOption, FilterOptionEnum, SplitOptionEnum} from '@constants';
import {UnitExpenseService} from "@unitExpenses";
import getApartmentExpenseRepository from "./apartmentExpenses.repository";
import Response from "./apartmentExpenses.response";
import ValidationException from "../exceptions/validation.exception";
import {Unit, UnitService} from "@units";
import {Transactional} from "typeorm-transactional-cls-hooked";

class ApartmentExpenseService {

    @Transactional()
    async createApartmentExpense(user: User, data: ObjectLiteral): Promise<ApartmentExpense> | never {
        try {
            console.log(data);
            const validData = validate(createApartmentExpenseSchema, data);
            const type = await ExpenseTypeService.getExpenseType(user, {id: validData.type});
            let units = await UnitService.getApartmentUnits(user, {apartment: validData.apartment});
            units = this.filterUnits(units, validData);
            let apartmentExpense = getApartmentExpenseRepository().create(validData);
            await getApartmentExpenseRepository().insert(apartmentExpense);
            const unitExpensesData = this.createUnitExpensesData(units, apartmentExpense, validData);
            apartmentExpense.unitExpenses = await Promise.all(unitExpensesData.map(async uData =>
                await UnitExpenseService.createUnitExpense(user, uData)));
            apartmentExpense = _.assign(apartmentExpense, {
                splitOption: SplitOption[apartmentExpense.splitOption],
                filterOption: FilterOption[apartmentExpense.filterOption]
            });
            return Response.createApartmentExpense(apartmentExpense, type);
        } catch (ex) {
            catchExceptions(ex);
        }
    }

    private createUnitExpensesData(units: Unit[], apartmentExpense: ApartmentExpense, data: ObjectLiteral): ObjectLiteral[] {
        switch (apartmentExpense.splitOption) {
            case SplitOptionEnum.equal:
                return units.map(u => ({
                    unit: u.id,
                    apartmentExpense: apartmentExpense.id,
                    amount: Math.round(apartmentExpense.amount / units.length)
                }));
            case SplitOptionEnum.residentCount:
                const residentSum = units.reduce((total, current) => total + current.residentCount, 0);
                return units.map(u => ({
                    unit: u.id,
                    apartmentExpense: apartmentExpense.id,
                    amount: Math.round(apartmentExpense.amount / residentSum * u.residentCount)
                }));
            case SplitOptionEnum.parkingSpaceCount:
                const parkingSpaceSum = units.reduce((total, current) => total + current.parkingSpaceCount, 0);
                return units.map(u => ({
                    unit: u.id,
                    apartmentExpense: apartmentExpense.id,
                    amount: Math.round(apartmentExpense.amount / parkingSpaceSum * u.parkingSpaceCount)
                }));
            case SplitOptionEnum.area:
                const areaSum = units.reduce((total, current) => total + current.area, 0);
                return units.map(u => ({
                    unit: u.id,
                    apartmentExpense: apartmentExpense.id,
                    amount: Math.round(apartmentExpense.amount / areaSum * u.area)
                }));
            case SplitOptionEnum.floor:
                const floorSum = units.reduce((total, current) => total + current.floor, 0);
                return units.map(u => ({
                    unit: u.id,
                    apartmentExpense: apartmentExpense.id,
                    amount: Math.round(apartmentExpense.amount / floorSum * u.floor)
                }));
            case SplitOptionEnum.specificCoefficients:
                const coefficientSum = data.coefficients.reduce((total, current) => total + current, 0);
                return data.units.map((unitId, i) => ({
                    unit: unitId,
                    apartmentExpense: apartmentExpense.id,
                    amount: Math.round(apartmentExpense.amount / coefficientSum * data.coefficients[i])
                }));
        }
    }

    private filterUnits(units: Unit[], data: ObjectLiteral): Unit[] {
        let filteredUnits = [];
        switch (data.filterOption) {
            case FilterOptionEnum.all:
                filteredUnits = units;
                break;
            case FilterOptionEnum.occupiedUnits:
                filteredUnits = units.filter(u => !u.isEmpty);
                break;
            case FilterOptionEnum.emptyUnits:
                filteredUnits = units.filter(u => u.isEmpty);
                break;
            case FilterOptionEnum.chosenUnits:
                if (data.units.some(u => !units.map(({id}) => id).includes(u)))
                    throw new ValidationException('حداقل یکی از واحدها در این آپارتمان نیست');
                return units.filter(u => data.units.includes(u.id));
        }
        if (data.splitOption === SplitOptionEnum.specificCoefficients &&
            data.units.some(u => !units.map(({id}) => id).includes(u)))
            throw new ValidationException('حداقل یکی از واحدها در این آپارتمان نیست');
        return filteredUnits;
    }


    async getAllApartmentExpenses(user: User, data: ObjectLiteral): Promise<ApartmentExpense[]> | never {
        try {
            const validData = validate(getAllApartmentExpensesSchema, data);
            const whereClause: ObjectLiteral = {
                apartment: validData.apartment
            };
            if (validData.declared !== undefined)
                whereClause.isDeclared = validData.declared;
            let apartmentExpenses = await getApartmentExpenseRepository().find({
                where: whereClause,
                relations: ['type'],
                order: {
                    createdAt: "DESC"
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

    getOptions(user: User, data: ObjectLiteral): ObjectLiteral {
        return {
            splitOptions: Object.values(SplitOption),
            filterOptions: Object.values(FilterOption)
        };
    };
}

export default new ApartmentExpenseService();
