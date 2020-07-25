import {getCustomRepository, QueryFailedError} from 'typeorm';
import _ from 'lodash';
import {createUserSchema, createTempUserSchema, getUserSchema, signInSchema} from './users.validation';
import {validate, catchExceptions} from '@utils';
import {ConflictException, ResourceNotFoundException, UnAuthorizedException} from '@exceptions';
import getUserRepository from './users.repository';
import {ObjectLiteral} from "@interfaces";
import User from "./users.entity";

const createUser = async (data: ObjectLiteral, temp: boolean = false): Promise<User> | never => {
    try {
        const validData = validate(temp ? createTempUserSchema : createUserSchema, data);
        const user = getUserRepository().create(validData);
        if (!temp)
            user.hashPassword();
        await getUserRepository().insert(user);
        return _.pick(user, ['id', 'firstName', 'lastName', 'mobileNumber']) as User;
    } catch (ex) {
        catchExceptions(ex, () => {
            if (ex instanceof QueryFailedError)
                throw new ConflictException('Mobile number already in use');
        });
    }
};

const getUser = async (data: ObjectLiteral): Promise<User> | never => {
    try {
        const validData = validate(getUserSchema, data);
        const user = await getUserRepository().findOne(validData, {
            select: ['id', 'firstName', 'lastName', 'mobileNumber']
        });
        if (!user)
            throw new ResourceNotFoundException('User not found');
        return user;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const signIn = async (data: ObjectLiteral): Promise<number> | never => {
    try {
        const validData = validate(signInSchema, data);
        const user = await getUserRepository().findOne({
            mobileNumber: validData.mobileNumber
        }, {
            select: ['id', 'firstName', 'lastName', 'mobileNumber', 'password']
        });
        if (!user)
            throw new ResourceNotFoundException('User not found');
        if (!user.isPasswordValid(validData.password))
            throw new UnAuthorizedException(`Password for ${user.mobileNumber} is wrong`);
        return user.id;
    } catch (ex) {
        catchExceptions(ex);
    }
};

const service = {
    createUser,
    getUser,
    signIn
};

export default service;
