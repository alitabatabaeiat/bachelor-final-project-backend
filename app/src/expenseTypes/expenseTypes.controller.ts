import express from "express";
import {Request} from '@interfaces';
import service from "./expenseTypes.service";
import {Message} from "@constants";

const createExpenseType = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const { baseUrl, user, body } = req;
    const expenseType = await service.createExpenseType(user, body);
    res.status(201).jsend.success(Message.successfullyCreated);
};

export default {
    createExpenseType
}
