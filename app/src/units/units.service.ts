import {getCustomRepository} from 'typeorm';
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
import UnitRepository from './units.repository';
import {ObjectLiteral, User} from "@interfaces";
import {UserService} from '@users';

const createUnit = async (user: User, data: ObjectLiteral): Promise<Unit> | never => {
    try {
        let validData = validate(createUnitSchema, data);
        const repository = getCustomRepository(UnitRepository);
        if (validData.resident) {
            const userData = {mobileNumber: validData.resident};
            const resident = await UserService.getUser(userData)
                .catch(async ex => {
                    if (ex instanceof ResourceNotFoundException)
                        return await UserService.createUser(userData, true);
                });
            validData.resident = resident.id;
        }
        const unit = repository.create(_.assign(validData));
        await repository.insert(unit);
        return _.pick(unit, ['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount',
            'fixedCharge', 'isEmpty']) as Unit;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const getResidentUnits = async (user: User, data: ObjectLiteral): Promise<Unit[]> | never => {
    try {
        const validData = validate(getResidentUnitsSchema, data);
        const repository = getCustomRepository(UnitRepository);
        const units = await repository.createQueryBuilder('unit')
            .select(['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'isEmpty'].map(s => `unit.${s}`))
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

const getApartmentUnits = async (user: User, data: ObjectLiteral): Promise<Unit[]> | never => {
    try {
        const validData = validate(getApartmentUnitsSchema, data);
        const repository = getCustomRepository(UnitRepository);
        const units = await repository.createQueryBuilder('unit')
            .select(['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'isEmpty'].map(s => `unit.${s}`))
            .addSelect(['firstName', 'lastName', 'mobileNumber'].map(s => `resident.${s}`))
            .leftJoin('unit.apartment', 'apt', 'apt.manager = :manager')
            .leftJoin('unit.resident', 'resident')
            .where('unit.apartment = :apartment')
            .setParameters({manager: user.id, apartment: validData.apartment})
            .getMany();
        return units;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const getUnitAsResident = async (user: User, data: ObjectLiteral): Promise<Unit> | never => {
    try {
        const validData = validate(getUnitAsResidentSchema, data);
        const repository = getCustomRepository(UnitRepository);
        const unit = await repository.findOne({
            where: {
                id: validData.id,
                resident: user.id
            },
            select: ['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'isEmpty']
        });
        if (!unit)
            throw new ResourceNotFoundException('Unit not found');
        return unit;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const getUnitAsManager = async (user: User, data: ObjectLiteral): Promise<Unit> | never => {
    try {
        const validData = validate(getUnitAsManagerSchema, data);
        const repository = getCustomRepository(UnitRepository);
        const unit = await repository.createQueryBuilder('unit')
            .select(['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'isEmpty'].map(s => `unit.${s}`))
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

const updateUnit = async (user: User, data: ObjectLiteral): Promise<void> | never => {
    try {
        const validData = validate(updateUnitSchema, data);
        const repository = getCustomRepository(UnitRepository);
        const unit = await repository.createQueryBuilder('unit')
            .select(['unit.id', 'resident.id'])
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
        if (validData.resident) {
            const userData = {mobileNumber: validData.resident};
            const resident = await UserService.getUser(userData)
                .catch(async ex => {
                    if (ex instanceof ResourceNotFoundException)
                        return await UserService.createUser(userData, true);
                });
            validData.resident = resident.id;
        }
        await repository.update(unit.id, validData);
    } catch (ex) {
        catchExceptions(ex);
    }
};

const deleteUnit = async (user: User, data: ObjectLiteral, skipManagerChecking: boolean = false): Promise<void> | never => {
    try {
        const validData = validate(deleteUnitSchema, data);
        const repository = getCustomRepository(UnitRepository);
        const query = repository.createQueryBuilder('unit')
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
        await repository.delete(unit.id);
    } catch (ex) {
        catchExceptions(ex);
    }
};

const service = {
    createUnit,
    getResidentUnits,
    getApartmentUnits,
    getUnitAsResident,
    getUnitAsManager,
    updateUnit,
    deleteUnit
};

export default service;
