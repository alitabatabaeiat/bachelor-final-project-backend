import express from "express";
import {Request} from '@interfaces';
import service from "./unitExpenses.service";
import _ from "lodash";
import {Role} from "@constants";

export const getAllExpenses = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, params} = req;
    if (_.includes(baseUrl, Role.manager))
        return next();
    const body = _.assign({}, {unit: params.unitId});
    const expenses = await service.getAllExpenses(user, body);
    res.jsend.success(expenses);
};
