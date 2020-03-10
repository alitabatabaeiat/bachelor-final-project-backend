import {Request, Response} from "express";
import service from "./apartments.service";
import _ from "lodash";

const createApartment = async (req: Request, res: Response) => {
    const { user, body } = req;
    const apartment = await service.createApartment(user.id, body);
    res.status(201).jsend.success('Apartment created successfully');
};

const getApartment = async (req: Request, res: Response) => {
    const { user, body, params } = req;
    const extendedBody = _.assign(body, {id: params.id});
    const apartment = await service.getApartment(user.id, extendedBody);
    res.jsend.success(apartment);
};

export default {
    createApartment,
    getApartment
}
