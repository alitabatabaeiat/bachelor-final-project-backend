import express from "express";
import {Request} from '@interfaces';
import service from "./apartments.service";
import _ from "lodash";
import {RESIDENT} from "@constants";

const createApartment = async (req: Request, res: express.Response) => {
    const { user, body } = req;
    const apartment = await service.createApartment(user.id, body);
    res.status(201).jsend.success('Apartment created successfully');
};

const getAllApartments = async (req: Request, res: express.Response) => {
    const { user, body } = req;
    const apartments = await service.getAllApartments(user, body);
    res.jsend.success(apartments);
};

const getApartment = async (req: Request, res: express.Response) => {
    const { user, body, params } = req;
    const extendedBody = _.assign(body, {id: params.id});
    const apartment = await service.getApartment(user, extendedBody);
    res.jsend.success(apartment);
};

const updateApartment = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const {baseUrl, user, body, params} = req;
    if (_.includes(baseUrl, RESIDENT))
        return next();
    const extendedBody = _.assign(body, {id: params.id});
    await service.updateApartment(user, extendedBody);
    res.jsend.success('Apartment updated successfully');
};

const deleteApartment = async (req: Request, res: express.Response) => {
    const { user, body, params } = req;
    const extendedBody = _.assign(body, {id: params.id});
    await service.deleteApartment(user, extendedBody);
    res.jsend.success('Apartment deleted successfully');
};

export default {
    createApartment,
    getAllApartments,
    getApartment,
    updateApartment,
    deleteApartment
}
