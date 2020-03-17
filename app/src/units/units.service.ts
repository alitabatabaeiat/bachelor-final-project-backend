import {getCustomRepository} from 'typeorm';
import _ from 'lodash';
import Unit from './units.entity';
import {createUnitSchema, getAllUnitsSchema, getUnitSchema, deleteUnitSchema} from './units.validation';
import {validate, catchExceptions, renameKey} from '@utils';
import {ResourceNotFoundException, PermissionDeniedException} from '@exceptions';
import UnitRepository from './units.repository';
import {ObjectLiteral, User} from "@interfaces";
import Apartment from "../apartments/apartments.entity";

const createUnit = async (user: number, data: ObjectLiteral): Promise<ObjectLiteral> | never => {
    try {
        let validData = validate(createUnitSchema, data);
        validData = renameKey(validData, 'apartmentId', 'apartment');
        const unit = new Unit(_.assign(validData, {resident: user}));
        console.log(unit);
        const repository = getCustomRepository(UnitRepository);
        await repository.insert(unit);
        return _.pick(unit, ['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'isEmpty']);
    } catch (ex) {
        catchExceptions(ex);
    }
};

const getAllUnits = async (user: User, data: ObjectLiteral, apartment: Apartment): Promise<ObjectLiteral> | never => {
    try {
        const validData = validate(getAllUnitsSchema, data);
        const repository = getCustomRepository(UnitRepository);
        if (apartment.manager.id !== user.id)
            throw new PermissionDeniedException("You don't have permission to get units of this apartment");
        const units = await repository.find({
            where: {
                apartment: validData.apartmentId
            },
            select: ['id', 'title', 'floor', 'area', 'parkingSpaceCount', 'residentCount', 'fixedCharge', 'isEmpty']
        });
        return units;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const getUnit = async (user: User, data: ObjectLiteral): Promise<ObjectLiteral> | never => {
    try {
        const validData = validate(getUnitSchema, data);
        const repository = getCustomRepository(UnitRepository);
        const unit = await repository.findOne({
            where: {
                id: validData.id,
                resident: user.id,
                apartment: validData.apartmentId
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

const deleteUnit = async (user: ObjectLiteral, data: ObjectLiteral, apartment: Apartment): Promise<void> | never => {
    try {
        const validData = validate(deleteUnitSchema, data);
        const repository = getCustomRepository(UnitRepository);
        const unit = await repository.findOne({
            where: {
                id: validData.id,
                apartment: validData.apartmentId
            },
            loadRelationIds: true
        });
        console.log(apartment);
        if (!unit)
            throw new ResourceNotFoundException('Unit not found');
        if (apartment.manager !== user.id && apartment.manager.id !== user.id)
            throw new PermissionDeniedException("You don't have permission to delete this unit");
        if (unit.resident)
            throw new PermissionDeniedException("You don't have permission to delete unit with resident");
        await repository.delete(unit.id);
    } catch (ex) {
        catchExceptions(ex);
    }
};

const service = {
    createUnit,
    getAllUnits,
    getUnit,
    deleteUnit
};

export default service;
