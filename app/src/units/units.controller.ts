import {Request, Response} from "express";
import service from "./units.service";
import _ from "lodash";

const createUnit = async (req: Request, res: Response) => {
    const { user, body, params } = req;
    const extendedBody = _.assign(body, {apartmentId: params.apartmentId});
    const apartment = await service.createUnit(user.id, extendedBody);
    res.status(201).jsend.success('Unit created successfully');
};

const getUnit = async (req: Request, res: Response) => {
    const { user, body, params } = req;
    const extendedBody = _.assign(body, {id: params.id, apartmentId: params.apartmentId});
    const apartment = await service.getUnit(user.id, extendedBody);
    res.jsend.success(apartment);
};

export default {
    createUnit,
    getUnit
}