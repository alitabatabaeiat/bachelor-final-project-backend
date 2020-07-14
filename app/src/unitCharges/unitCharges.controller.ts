import express from "express";
import {Request} from '@interfaces';
import service from "./unitCharges.service";
import _ from "lodash";
import {Role} from "@constants";

export const getAllCharges = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, params} = req;
    if (_.includes(baseUrl, Role.manager))
        return next();
    const body = _.assign({}, {unit: params.unitId});
    const charges = await service.getAllCharges(user, body);
    res.jsend.success(charges);
};
