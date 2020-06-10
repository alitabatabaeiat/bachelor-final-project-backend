import express from "express";
import {Request} from '@interfaces';
import service from "./charges.service";
import _ from "lodash";
import {Role} from "@constants";

export const createCharge = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, body} = req;
    if (_.includes(baseUrl, Role.resident))
        return next();
    const charge = await service.createCharge(user, body);
    res.status(201).jsend.success(charge);
};
