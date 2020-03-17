import express from "express";
import {Request} from '@interfaces';
import service from "./units.service";
import _ from "lodash";

const createUnit = async (req: Request, res: express.Response) => {
    const { user, body, params } = req;
    const extendedBody = _.assign(body, {apartmentId: params.apartmentId});
    const unit = await service.createUnit(user.id, extendedBody);
    res.status(201).jsend.success('Unit created successfully');
};

const getAllUnits = async (req: Request, res: express.Response) => {
    const { user, apartment, body, params } = req;
    const extendedBody = _.assign(body, {apartmentId: params.apartmentId});
    const units = await service.getAllUnits(user, extendedBody, apartment);
    res.jsend.success(units);
};

const getUnit = async (req: Request, res: express.Response) => {
    const { user, body, params } = req;
    const extendedBody = _.assign(body, {id: params.id, apartmentId: params.apartmentId});
    const unit = await service.getUnit(user, extendedBody);
    res.jsend.success(unit);
};

const deleteUnit = async (req: Request, res: express.Response) => {
    const { user, apartment, body, params } = req;
    const extendedBody = _.assign(body, {id: params.id, apartmentId: params.apartmentId});
    await service.deleteUnit(user, extendedBody, apartment);
    res.jsend.success('Unit deleted successfully');
};

export default {
    createUnit,
    getAllUnits,
    getUnit,
    deleteUnit
}
