import _ from 'lodash';
import Apartment from './apartments.entity';
import {
    createApartmentSchema,
    getAllApartmentsSchema,
    getApartmentSchema,
    updateApartmentSchema,
    deleteApartmentSchema
} from './apartments.validation';
import {validate, catchExceptions} from '@utils';
import {ResourceNotFoundException, PermissionDeniedException} from '@exceptions';
import getApartmentRepository from './apartments.repository';
import {ObjectLiteral, User} from "@interfaces";
import {UnitService} from '@units'
import getSettingRepository from "../settings/settings.repository";
import {Transactional} from "typeorm-transactional-cls-hooked";

class ApartmentService {

    @Transactional()
    async createApartment(user: User, data: ObjectLiteral): Promise<Apartment> | never {
        try {
            const validData = validate(createApartmentSchema, data);
            const apartment = getApartmentRepository().create(_.assign(validData, {manager: user}));
            await getApartmentRepository().insert(apartment);
            const setting = getSettingRepository().create({apartment});
            await getSettingRepository().insert(setting);
            return _.pick(apartment, ['id', 'title', 'city', 'address']) as Apartment;
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getAllApartments(user: User, data: ObjectLiteral): Promise<Apartment[]> | never {
        try {
            const validData = validate(getAllApartmentsSchema, data);
            const apartments = await getApartmentRepository().find({
                where: {
                    manager: user.id
                }
            });
            return apartments;
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async getApartment(user: User, data: ObjectLiteral, loadUnits: boolean = false): Promise<Apartment> | never {
        try {
            const validData = validate(getApartmentSchema, data);
            const relations = loadUnits ? ['manager', 'units'] : ['manager'];
            const apartment = await getApartmentRepository().findOne({
                where: {
                    id: validData.id,
                    manager: user.id
                },
                relations
            });
            if (!apartment)
                throw new ResourceNotFoundException('Apartment not found');
            return apartment;
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async updateApartment(user: User, data: ObjectLiteral): Promise<void> | never {
        try {
            const validData = validate(updateApartmentSchema, data);
            const apartment = await getApartmentRepository().findOne({
                where: {
                    id: validData.id,
                    manager: user.id
                },
                select: ['id']
            });
            if (!apartment)
                throw new ResourceNotFoundException('Apartment not found');
            await getApartmentRepository().update(apartment.id, validData);
        } catch (ex) {
            catchExceptions(ex);
        }
    };

    async deleteApartment(user: User, data: ObjectLiteral): Promise<void> | never {
        try {
            const validData = validate(deleteApartmentSchema, data);
            const apartment = await getApartmentRepository().findOne({
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
            await getApartmentRepository().delete(apartment.id);
        } catch (ex) {
            catchExceptions(ex, () => {
                if (ex instanceof PermissionDeniedException)
                    throw new PermissionDeniedException("You don't have permission apartment that have unit with resident");
            });
        }
    };

}

export default new ApartmentService();
