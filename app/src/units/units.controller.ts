import express from "express";
import {Request} from '@interfaces';
import service from "./units.service";
import _ from "lodash";
import {Role} from "@constants";

const createUnit = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, body} = req;
    if (_.includes(baseUrl, Role.resident))
        return next();
    const unit = await service.createUnit(user, body);
    res.status(201).jsend.success(unit);
};

const getAllUnits = async (req: Request, res: express.Response) => {
    const {baseUrl, user, body, query} = req;
    const extendedBody = _.assign(body, {apartment: query.apartment, isEmpty: query.isEmpty});
    let units = [];
    if (_.includes(baseUrl, Role.resident))
        units = await service.getResidentUnits(user, extendedBody);
    else
        units = await service.getApartmentUnits(user, extendedBody);
    res.jsend.success(units);
};

const getUnit = async (req: Request, res: express.Response) => {
    const {baseUrl, user, body, params} = req;
    const extendedBody = _.assign(body, {id: params.id});
    let unit;
    if (_.includes(baseUrl, Role.resident))
        unit = await service.getUnitAsResident(user, extendedBody);
    else
        unit = await service.getUnitAsManager(user, extendedBody);
    res.jsend.success(unit);
};

const updateUnit = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, body, params} = req;
    if (_.includes(baseUrl, Role.resident))
        return next();
    const extendedBody = _.assign(body, {id: params.id});
    const unit = await service.updateUnit(user, extendedBody);
    res.jsend.success(unit);
};

const deleteUnit = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, body, params} = req;
    if (_.includes(baseUrl, Role.resident))
        return next();
    const extendedBody = _.assign(body, {id: params.id});
    const unit = await service.deleteUnit(user, extendedBody);
    res.jsend.success(unit);
};

export default {
    createUnit,
    getAllUnits,
    getUnit,
    updateUnit,
    deleteUnit
}
