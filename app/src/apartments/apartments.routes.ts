import {Router} from 'express';
import controller from './apartments.controller';
import {asyncWrapper} from '@utils';
import {routes as unitsRouter} from "@units";
import {apartmentMiddleware} from "@middleware";

const router = Router();

router.post('/', asyncWrapper(controller.createApartment));
router.get('/', asyncWrapper(controller.getAllApartments));
router.get('/:id', asyncWrapper(controller.getApartment));
router.delete('/:id', asyncWrapper(controller.deleteApartment));

router.use('/:apartmentId/units', apartmentMiddleware(), unitsRouter);

export default router;
