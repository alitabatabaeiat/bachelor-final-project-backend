import _ from 'lodash';
import Unit from './units.entity';
import {
    createUnitSchema,
    getResidentUnitsSchema,
    getApartmentUnitsSchema,
    getUnitAsResidentSchema,
    getUnitAsManagerSchema,
    updateUnitSchema,
    deleteUnitSchema
} from './units.validation';
import {validate, catchExceptions} from '@utils';
import {ResourceNotFoundException, PermissionDeniedException} from '@exceptions';
import getUnitRepository from './units.repository';
import Response from './units.response';
import {ObjectLiteral, User} from "@interfaces";
import {UserService} from '@users';

class UnitService {
    async createUnit(user: User, data: ObjectLiteral): Promise<Unit> | never {
        try {
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
            const unit = getUnitRepository().create(_.assign(validData));
            await getUnitRepository().insert(unit);
            return Response.createUnit(unit, resident);
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getResidentUnits (user: User, data: ObjectLiteral): Promise<Unit[]> | never {
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

    async getApartmentUnits (user: User, data: ObjectLiteral): Promise<Unit[]> | never {
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
            const minPowerConsumption = _.minBy(units,
                    unit => unit.powerConsumption === 0 ? Number.MAX_SAFE_INTEGER : unit.powerConsumption).powerConsumption;
            units = units.map((unit: any) => {
                unit.consumptionCoefficient = unit.powerConsumption / minPowerConsumption;
                return unit;
            });
            if (validData.isEmpty !== undefined)
                units = units.filter(unit => unit.isEmpty === validData.isEmpty);
            return units;
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getUnitAsResident (user: User, data: ObjectLiteral): Promise<Unit> | never {
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

    async getUnitAsManager (user: User, data: ObjectLiteral): Promise<Unit> | never {
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

    async updateUnit (user: User, data: ObjectLiteral): Promise<Unit> | never {
        try {
            const validData = validate(updateUnitSchema, data);
            const unit = await getUnitRepository().createQueryBuilder('unit')
                .select(['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'powerConsumption', 'isEmpty'].map(s => `unit.${s}`))
                .addSelect(['id','firstName', 'lastName', 'mobileNumber'].map(s => `resident.${s}`))
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

    async deleteUnit (user: User, data: ObjectLiteral, skipManagerChecking: boolean = false): Promise<Unit> | never {
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
