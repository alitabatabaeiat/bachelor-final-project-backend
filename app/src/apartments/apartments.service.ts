import {getCustomRepository} from 'typeorm';
import _ from 'lodash';
import Apartment from './apartments.entity';
import {createApartmentSchema, getApartmentSchema} from './apartments.validation';
import {validate, catchExceptions} from '@utils';
import {ResourceNotFoundException} from '@exceptions';
import ApartmentRepository from './apartments.repository';
import {ObjectLiteral} from "@interfaces";

const createApartment = async (user: number, data: object): Promise<ObjectLiteral> | never => {
    try {
        const validData = validate(createApartmentSchema, data);
        const apartment = new Apartment(_.assign(validData, {manager: user}));
        const repository = getCustomRepository(ApartmentRepository);
        await repository.insert(apartment);
        return _.pick(apartment, ['id', 'title', 'city', 'address']);
    } catch (ex) {
        catchExceptions(ex);
    }
};

const getApartment = async (user: number, data: object): Promise<ObjectLiteral> | never => {
    try {
        const validData = validate(getApartmentSchema, data);
        const repository = getCustomRepository(ApartmentRepository);
        const apartment = await repository.findOne({
            where: {
                id: validData.id,
                manager: user
            },
            select: ['id', 'title', 'city', 'address']
        });
        if (!apartment)
            throw new ResourceNotFoundException('Apartment not found');
        return apartment;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const service = {
    createApartment,
    getApartment
};

export default service;
