import {NextFunction, Request, Response} from "express"
import {service as ApartmentService} from "@apartments";
import HttpException from "../exceptions/http.exception";

const apartmentMiddleware = () =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log(req.params);
            req.apartment = await ApartmentService.getApartment(req.user?.id, {id: req.params.apartmentId});
            next()
        } catch (ex) {
            if (ex instanceof HttpException)
                next(ex);
            next(new HttpException());
        }
    };

export default apartmentMiddleware;

