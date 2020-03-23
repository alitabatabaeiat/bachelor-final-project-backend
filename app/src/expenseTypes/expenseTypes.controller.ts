import express from "express";
import {Request} from '@interfaces';
import service from "./expenseTypes.service";
import {Message} from "@constants";

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

export default {
    createExpenseType,
    getAllExpenseTypes
}
