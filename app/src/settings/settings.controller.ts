import express from "express";
import {Request} from '@interfaces';
import service from "./settings.service";
import _ from "lodash";
import {Role} from "@constants";

export const updateApartmentSetting = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, body, params} = req;
    if (_.includes(baseUrl, Role.resident))
        return next();
    const extendedBody = _.assign(body, {apartment: params.apartmentId});
    const setting = await service.updateApartmentSetting(user, extendedBody);
    res.jsend.success(setting);
};

export const getApartmentSetting = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, params} = req;
    if (_.includes(baseUrl, Role.resident))
        return next();
    const body = _.assign({}, {apartment: params.apartmentId});
    const setting = await service.getApartmentSetting(user, body);
    res.jsend.success(setting);
};
