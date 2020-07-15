import express from "express";
import {Request} from '@interfaces';
import service from "./charges.service";
import _ from "lodash";
import {Role} from "@constants";

export const createCharge = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, body, params} = req;
    if (_.includes(baseUrl, Role.resident))
        return next();
    const extendedBody = _.assign(body, {apartment: params.apartmentId});
    const charge = await service.createCharge(user, extendedBody);
    res.status(201).jsend.success(charge);
};

export const getAllCharges = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, params} = req;
    if (_.includes(baseUrl, Role.resident))
        return next();
    const body = _.assign({}, {apartment: params.apartmentId});
    const charges = await service.getAllCharges(user, body);
    res.jsend.success(charges);
};

export const getCharge = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, params} = req;
    if (_.includes(baseUrl, Role.resident))
        return next();
    const body = _.assign({}, {id: params.id, apartment: params.apartmentId});
    const charges = await service.getCharge(user, body);
    res.jsend.success(charges);
};
