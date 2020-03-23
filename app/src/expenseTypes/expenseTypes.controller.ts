import express from "express";
import {Request} from '@interfaces';
import service from "./expenseTypes.service";
import {Message} from "@constants";
import _ from "lodash";

const createExpenseType = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const { user, body } = req;
    const expenseType = await service.createExpenseType(user, body);
    res.status(201).jsend.success(Message.successfullyCreated);
};

const getAllExpenseTypes = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const { user, body } = req;
    const expenseTypes = await service.getAllExpenseTypes(user, body);
    res.status(201).jsend.success(expenseTypes);
};

const getExpenseType = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const { user, body, params } = req;
    const extendedBody = _.assign(body, {id: params.id});
    const expenseTypes = await service.getExpenseType(user, extendedBody);
    res.status(201).jsend.success(expenseTypes);
};

export default {
    createExpenseType,
    getAllExpenseTypes,
    getExpenseType
}
