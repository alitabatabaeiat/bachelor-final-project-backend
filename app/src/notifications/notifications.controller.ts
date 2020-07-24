import express from "express";
import {Request} from '@interfaces';
import service from "./notifications.service";
import _ from "lodash";
import {Role} from "@constants";

export const createNotification = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, body, params} = req;
    if (_.includes(baseUrl, Role.resident))
        return next();
    const charge = await service.createNotification(user, body);
    res.status(201).jsend.success(charge);
};

export const getAllNotifications = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, query} = req;
    const body = _.assign({}, {apartment: query.apartment});
    const charges = await service.getAllNotifications(user, body);
    res.jsend.success(charges);
};

// export const getNotification = async (req: Request, res: express.Response, next: express.NextFunction) => {
//     const {baseUrl, user, params} = req;
//     if (_.includes(baseUrl, Role.resident))
//         return next();
//     const body = _.assign({}, {id: params.id, apartment: params.apartmentId});
//     const charges = await service.getNotification(user, body);
//     res.jsend.success(charges);
// };
