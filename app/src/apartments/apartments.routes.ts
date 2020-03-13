import {Router} from 'express';
import controller from './apartments.controller';
import {asyncWrapper} from '@utils';
import {routes as unitsRouter} from "@units";
import {apartmentMiddleware} from "@middleware";

const router = Router();

router.post('/', asyncWrapper(controller.createApartment));
router.get('/:id', asyncWrapper(controller.getApartment));

router.use('/:apartmentId/units', apartmentMiddleware(), unitsRouter);

export default router;
