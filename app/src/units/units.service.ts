import _ from 'lodash';
import XLSX from 'xlsx';
import Unit from './units.entity';
import {
    createMultipleUnitsSchema,
    createUnitSchema,
    deleteUnitSchema,
    getApartmentUnitsSchema,
    getResidentUnitsSchema,
    getUnitAsManagerSchema,
    getUnitAsResidentSchema,
    getUnitsCountSchema,
    updateUnitSchema
} from './units.validation';
import {catchExceptions, validate} from '@utils';
import {PermissionDeniedException, ResourceNotFoundException} from '@exceptions';
import getUnitRepository from './units.repository';
import Response from './units.response';
import {ObjectLiteral, User} from "@interfaces";
import {UserService} from '@users';
import {Transactional} from "typeorm-transactional-cls-hooked";
import getApartmentRepository from "../apartments/apartments.repository";

const excel = {
    title: 'A',
    floor: 'B',
    area: 'D',
    parkingSpaceCount: 'F',
    residentCount: 'E',
    fixedCharge: 'C',
    powerConsumption: 'I',
    isEmpty: 'H',
    resident: 'G'
};

class UnitService {
    @Transactional()
    async createUnit(user: User, data: ObjectLiteral): Promise<Unit> | never {
        try {
            console.log(data);
            let validData = validate(createUnitSchema, data);
            let resident = null;
            if (validData.resident) {
                const userData = {mobileNumber: validData.resident};
                resident = await UserService.getUser(userData)
                    .catch(async ex => {
                        if (ex instanceof ResourceNotFoundException)
                            return await UserService.createUser(userData, true);
                    });
                validData.resident = resident.id;
            }
            const unit = getUnitRepository().create(validData);
            await getUnitRepository().insert(unit);
            return Response.createUnit(unit, resident);
        } catch (ex) {
            console.log(ex);
            catchExceptions(ex);
        }
    };

    @Transactional()
    async createMultipleUnits(user: User, data: ObjectLiteral): Promise<Unit[]> | never {
        try {
            const validData = validate(createMultipleUnitsSchema, data);
            const workbook = XLSX.read(validData.file, {type: 'buffer'});
            const sheet = workbook.Sheets['Sheet1'];
            let unitDataList = [], i = 2;
            while (true) {
                if (!sheet[`A${i}`])
                    break;
                const unit: ObjectLiteral = {
                    apartment: validData.apartment
                };
                _.forEach(excel, (value, key) => {
                    const cell = sheet[value + i];
                    unit[key] = cell ? cell.v : undefined
                });
                unitDataList.push(unit);
                i++;
            }
            return await Promise.all(unitDataList.map(async unit => this.createUnit(user, unit)));
        } catch (ex) {
            console.log(ex);
            catchExceptions(ex);
        }
    };

    async getResidentUnits(user: User, data: ObjectLiteral): Promise<Unit[]> | never {
        try {
            const validData = validate(getResidentUnitsSchema, data);
            const units = await getUnitRepository().createQueryBuilder('unit')
                .select(['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'powerConsumption', 'isEmpty'].map(s => `unit.${s}`))
                .addSelect(['id', 'title', 'city', 'address'].map(s => `apt.${s}`))
                .leftJoin('unit.apartment', 'apt')
                .where('unit.resident = :resident')
                .setParameter('resident', user.id)
                .getMany();
            return units;
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getApartmentUnits(user: User, data: ObjectLiteral): Promise<Unit[]> | never {
        try {
            const validData = validate(getApartmentUnitsSchema, data);
            let units = await getUnitRepository().createQueryBuilder('unit')
                .select(['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge',
                    'powerConsumption', 'suggestedConsumptionCoefficient', 'isEmpty'].map(s => `unit.${s}`))
                .addSelect(['firstName', 'lastName', 'mobileNumber'].map(s => `resident.${s}`))
                .leftJoin('unit.apartment', 'apt', 'apt.manager = :manager')
                .leftJoin('unit.resident', 'resident')
                .where('unit.apartment = :apartment')
                .setParameters({manager: user.id, apartment: validData.apartment})
                .getMany();
            if (units.length > 0) {
                const minPowerConsumption = _.minBy(units,
                    unit => unit.powerConsumption === 0 ? Number.MAX_SAFE_INTEGER : unit.powerConsumption).powerConsumption;
                units = units.map((unit: any) => {
                    unit.consumptionCoefficient = unit.powerConsumption / minPowerConsumption;
                    return unit;
                });
                if (validData.isEmpty !== undefined)
                    units = units.filter(unit => unit.isEmpty === validData.isEmpty);
            }
            return units;
        } catch (ex) {
            console.log(ex);
            catchExceptions(ex);
        }
    };

    async getUnitAsResident(user: User, data: ObjectLiteral): Promise<Unit> | never {
        try {
            const validData = validate(getUnitAsResidentSchema, data);
            const unit = await getUnitRepository().findOne({
                where: {
                    id: validData.id,
                    resident: user.id
                },
                select: ['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'powerConsumption', 'isEmpty']
            });
            if (!unit)
                throw new ResourceNotFoundException('Unit not found');
            return unit;
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getUnitAsManager(user: User, data: ObjectLiteral): Promise<Unit> | never {
        try {
            const validData = validate(getUnitAsManagerSchema, data);
            const unit = await getUnitRepository().createQueryBuilder('unit')
                .select(['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'powerConsumption', 'isEmpty'].map(s => `unit.${s}`))
                .addSelect(['firstName', 'lastName', 'mobileNumber'].map(s => `resident.${s}`))
                .leftJoin('unit.apartment', 'apt', 'apt.manager = :manager')
                .leftJoin('unit.resident', 'resident')
                .where('unit.id = :id')
                .setParameters({id: validData.id, manager: user.id})
                .getOne();
            if (!unit)
                throw new ResourceNotFoundException('Unit not found');
            return unit;
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getUnitsCount(user: User, data: ObjectLiteral): Promise<number> | never {
        try {
            const validData = validate(getUnitsCountSchema, data);
            await getApartmentRepository().findOne(validData.apartment);
            return await getUnitRepository().count({where: {apartment: validData.apartment}});
        } catch (ex) {
            catchExceptions(ex);
        }
    }

    async updateUnit(user: User, data: ObjectLiteral): Promise<Unit> | never {
        try {
            const validData = validate(updateUnitSchema, data);
            const unit = await getUnitRepository().createQueryBuilder('unit')
                .select(['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'powerConsumption', 'isEmpty'].map(s => `unit.${s}`))
                .addSelect(['id', 'firstName', 'lastName', 'mobileNumber'].map(s => `resident.${s}`))
                .leftJoin('unit.apartment', 'apt', 'apt.manager = :manager')
                .leftJoin('unit.resident', 'resident')
                .where('unit.id = :id')
                .setParameters({
                    id: validData.id,
                    manager: user.id
                })
                .getOne();
            if (!unit)
                throw new ResourceNotFoundException('Unit not found');

            let resident = unit.resident;
            if (validData.resident) {
                const userData = {mobileNumber: validData.resident};
                resident = await UserService.getUser(userData)
                    .catch(async ex => {
                        if (ex instanceof ResourceNotFoundException)
                            return await UserService.createUser(userData, true);
                    });
                validData.resident = resident.id;
            }
            resident = validData.resident === null ? null : resident;
            await getUnitRepository().update(unit.id, validData);
            return Response.createUnit(_.assign(unit, validData), resident);
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async deleteUnit(user: User, data: ObjectLiteral, skipManagerChecking: boolean = false): Promise<Unit> | never {
        try {
            const validData = validate(deleteUnitSchema, data);
            const query = getUnitRepository().createQueryBuilder('unit')
                .select(['unit.id', 'resident.id'])
                .leftJoin('unit.resident', 'resident')
                .where('unit.id = :id')
                .setParameter('id', validData.id);
            if (!skipManagerChecking)
                query.leftJoin('unit.apartment', 'apt', 'apt.manager = :manager')
                    .setParameter('manager', user.id);
            const unit = await query.getOne();
            if (!unit)
                throw new ResourceNotFoundException('Unit not found');
            if (unit.resident)
                throw new PermissionDeniedException("You don't have permission to delete unit with resident");
            await getUnitRepository().delete(unit.id);
            return Response.createUnit(unit);
        } catch (ex) {
            catchExceptions(ex);
        }
    };
}


export default new UnitService();
