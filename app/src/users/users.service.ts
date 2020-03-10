import {getCustomRepository, QueryFailedError} from 'typeorm';
import _ from 'lodash';
import User from './users.entity';
import {createUserSchema, createTempUserSchema, getUserSchema} from './users.validation';
import {validate, catchExceptions} from '@utils';
import {ConflictException, ResourceNotFoundException} from '@exceptions';
import UserRepository from './users.repository';
import {ObjectLiteral} from "@interfaces";

const createUser = async (data: object, temp: boolean = false): Promise<ObjectLiteral> | never => {
    try {
        const validData = validate(temp ? createTempUserSchema : createUserSchema, data);
        const user = new User(validData);
        if (!temp)
            user.hashPassword();

        const repository = getCustomRepository(UserRepository);
        await repository.insert(user);
        return _.pick(user, ['id', 'firstName', 'lastName', 'mobileNumber']);
    } catch (ex) {
        catchExceptions(ex, () => {
            if (ex instanceof QueryFailedError)
                throw new ConflictException('Mobile number already in use');
        });
    }
};

const getUser = async (data: object): Promise<ObjectLiteral> | never => {
    try {
        const validData = validate(getUserSchema, data);

        const repository = getCustomRepository(UserRepository);
        const user = await repository.findOne(validData, {
            select: ['id', 'firstName', 'lastName', 'mobileNumber']
        });
        if (!user)
            throw new ResourceNotFoundException('User not found');
        return user;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const service = {
    createUser,
    getUser
};

export default service;
