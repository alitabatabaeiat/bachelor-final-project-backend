import express from "express";
import {Request} from '@interfaces';
import Service from "./apartmentExpenses.service";
import _ from "lodash";

const createApartmentExpense = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const { user, body, params } = req;
    const extendedBody = _.assign(body, {apartment: params.apartmentId});
    const apartmentExpense = await Service.createApartmentExpense(user, extendedBody);
    res.status(201).jsend.success(apartmentExpense);
};

const getAllApartmentExpenses = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const { user, body, params } = req;
    const extendedBody = _.assign(body, {apartment: params.apartmentId});
    const apartmentExpenses = await Service.getAllApartmentExpenses(user, extendedBody);
    res.jsend.success(apartmentExpenses);
};

const getOptions = async (req: Request, res: express.Response, next: express.NextFunction) => {
    const { user, body, params } = req;
    const options = Service.getOptions(user, body);
    res.jsend.success(options);
};

export default {
    createApartmentExpense,
    getAllApartmentExpenses,
    getOptions
}
