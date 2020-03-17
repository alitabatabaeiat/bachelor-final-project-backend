import express from "express";
import {Request} from '@interfaces';
import {service as ApartmentService} from "@apartments";
import HttpException from "../exceptions/http.exception";

const apartmentMiddleware = () =>
    async (req: Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        try {
            req.apartment = await ApartmentService.getApartment(req.user?.id, {id: req.params.apartmentId});
            next()
        } catch (ex) {
            if (ex instanceof HttpException)
                next(ex);
            next(new HttpException());
        }
    };

export default apartmentMiddleware;

