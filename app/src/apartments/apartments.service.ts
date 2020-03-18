import {getCustomRepository} from 'typeorm';
import _ from 'lodash';
import Apartment from './apartments.entity';
import {createApartmentSchema, getAllApartmentsSchema, getApartmentSchema, deleteApartmentSchema} from './apartments.validation';
import {validate, catchExceptions} from '@utils';
import {ResourceNotFoundException, PermissionDeniedException} from '@exceptions';
import ApartmentRepository from './apartments.repository';
import {ObjectLiteral, User} from "@interfaces";
import {UnitService} from '@units'

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

const getAllApartments = async (user: User, data: object): Promise<Apartment[]> | never => {
    try {
        const validData = validate(getAllApartmentsSchema, data);
        const repository = getCustomRepository(ApartmentRepository);
        const apartments = await repository.find({
            where: {
                manager: user.id
            },
            select: ['id', 'title', 'city', 'address']
        });
        return apartments;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const getApartment = async (user: User, data: ObjectLiteral): Promise<Apartment> | never => {
    try {
        const validData = validate(getApartmentSchema, data);
        const repository = getCustomRepository(ApartmentRepository);
        const apartment = await repository.createQueryBuilder('apt')
            .select(['apt.id', 'apt.title', 'apt.city', 'apt.address'])
            .addSelect(['manager.id', 'manager.firstName', 'manager.lastName'])
            .leftJoin('apt.manager', 'manager')
            .where('apt.id = :id')
            .andWhere('apt.manager = :managerId')
            .setParameters({id: validData.id, managerId: user.id})
            .getOne();
        if (!apartment)
            throw new ResourceNotFoundException('Apartment not found');
        return apartment;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const deleteApartment = async (user: ObjectLiteral, data: object): Promise<void> | never => {
    try {
        const validData = validate(deleteApartmentSchema, data);
        const repository = getCustomRepository(ApartmentRepository);
        const apartment = await repository.findOne({
            where: {
                id: validData.id,
                manager: user.id
            },
            loadRelationIds: true
        });
        if (!apartment)
            throw new ResourceNotFoundException('Apartment not found');
        if (apartment.units.length > 0) {
            await Promise.all(apartment.units.map(async unit =>
                await UnitService.deleteUnit(user, {id: unit})
            ));
        }
        await repository.delete(apartment.id);
    } catch (ex) {
        catchExceptions(ex, () => {
            if (ex instanceof PermissionDeniedException)
                throw new PermissionDeniedException("You don't have permission apartment that have unit with resident");
        });
    }
};

const service = {
    createApartment,
    getAllApartments,
    getApartment,
    deleteApartment
};

export default service;
