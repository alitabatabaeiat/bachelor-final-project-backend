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
import UnitExpense from "../unitExpenses/unitExpenses.entity";

class ApartmentExpenseService {

    @Transactional()
    async createApartmentExpense(user: User, data: ObjectLiteral): Promise<ApartmentExpense> | never {
        try {
            const validData = validate(createApartmentExpenseSchema, data);
            const type = await ExpenseTypeService.getExpenseType(user, {id: validData.type});
            let units = await UnitService.getApartmentUnits(user, {apartment: validData.apartment});
            let apartmentExpense = getApartmentExpenseRepository().create(validData);
            await getApartmentExpenseRepository().insert(apartmentExpense);
            const unitExpensesData = this.createUnitExpensesData(units, apartmentExpense, validData);
            apartmentExpense.unitExpenses = await Promise.all(_.map(unitExpensesData, async (value, key) =>
                await UnitExpenseService.createUnitExpense(user, {
                    unit: key,
                    apartmentExpense: apartmentExpense.id,
                    amount: value
                })
            ));
            apartmentExpense = _.assign(apartmentExpense, {
                splitOption: SplitOption[apartmentExpense.splitOption],
                filterOption: FilterOption[apartmentExpense.filterOption]
            });
            return Response.createApartmentExpense(apartmentExpense, type);
        } catch (ex) {
            catchExceptions(ex);
        }
    }

    async getCalculatedExpenses(user: User, data: ObjectLiteral): Promise<UnitExpense[]> | never {
        try {
            const validData = validate(createApartmentExpenseSchema, data);
            let units = await UnitService.getApartmentUnits(user, {apartment: validData.apartment});
            let apartmentExpense = getApartmentExpenseRepository().create(validData);
            const unitExpensesData = this.createUnitExpensesData(units, apartmentExpense, validData);
            console.log(units);
            return _.map(unitExpensesData, (value, key) => {
                const unit: any = _.find(units, ['id', parseInt(key)]);
                unit.amount = value;
                return unit;
            }) as UnitExpense[];
        } catch (ex) {
            catchExceptions(ex);
        }
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

    private createUnitExpensesData(units: Unit[], apartmentExpense: ApartmentExpense, data: ObjectLiteral): ObjectLiteral {
        let filteredUnits = this.filterUnits(units, data);
        let total = 0;
        switch (apartmentExpense.splitOption) {
            case SplitOptionEnum.equal:
                total = filteredUnits.length;
                filteredUnits.forEach((u: any) => u.share = 1);
                break;
            case SplitOptionEnum.residentCount:
                total = _.sumBy(filteredUnits, (u: any) => {
                    u.share = u.residentCount;
                    return u.share;
                });
                break;
            case SplitOptionEnum.parkingSpaceCount:
                total = _.sumBy(filteredUnits, (u: any) => {
                    u.share = u.parkingSpaceCount;
                    return u.share;
                });
                break;
            case SplitOptionEnum.area:
                total = _.sumBy(filteredUnits, (u: any) => {
                    u.share = u.area;
                    return u.share;
                });
                break;
            case SplitOptionEnum.floor:
                total = _.sumBy(filteredUnits, (u: any) => {
                    u.share = u.floor;
                    return u.share;
                });
                break;
            case SplitOptionEnum.specificCoefficients:
                total = _.sum(data.coefficients);
                filteredUnits = data.units.map((unitId, i) => {
                    const unit: any = _.find(filteredUnits, ['id', unitId]);
                    console.log(unit);
                    unit.share = data.coefficients[i];
                    return unit;
                });
                break;
            case SplitOptionEnum.consumptionCoefficient:
                const minPowerConsumption = _.minBy(units,
                    u => u.powerConsumption === 0 ? Number.MAX_SAFE_INTEGER : u.powerConsumption).powerConsumption;
                total = _.sumBy(filteredUnits, (u: any) => {
                    u.share = u.suggestedConsumptionCoefficient > 0 ?
                        u.suggestedConsumptionCoefficient : u.powerConsumption / minPowerConsumption;
                    return u.share;
                });
                break;
            case SplitOptionEnum.residentCountAndFloor:
                total = _.sumBy(filteredUnits, (u: any) => {
                    u.share = u.residentCount * u.floor;
                    return u.share;
                });
                break;
        }
        return _.assign({}, ..._.chain(filteredUnits).map((u: any) => ({
            [u.id]: Math.round(apartmentExpense.amount * u.share / total)
        })).value());
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
}

export default new ApartmentExpenseService();
