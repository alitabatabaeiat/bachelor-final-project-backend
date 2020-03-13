import {getCustomRepository} from 'typeorm';
import _ from 'lodash';
import Unit from './units.entity';
import {createUnitSchema, getUnitSchema} from './units.validation';
import {validate, catchExceptions, renameKey} from '@utils';
import {ResourceNotFoundException} from '@exceptions';
import UnitRepository from './units.repository';
import {ObjectLiteral} from "@interfaces";

const createUnit = async (user: number, data: object): Promise<ObjectLiteral> | never => {
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

const getUnit = async (user: number, data: object): Promise<ObjectLiteral> | never => {
    try {
        const validData = validate(getUnitSchema, data);
        const repository = getCustomRepository(UnitRepository);
        const unit = await repository.findOne({
            where: {
                id: validData.id,
                resident: user,
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
    return {};
};

const service = {
    createUnit,
    getUnit
};

export default service;
