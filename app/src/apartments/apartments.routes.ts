import {Router} from 'express';
import controller from './apartments.controller';
import {asyncWrapper} from '@utils';
import {ApartmentExpenseRoutes} from "@apartmentExpenses";
import {ChargeRoutes} from "@charges";
import {SettingRoutes} from "../settings";

const router = Router();

router.post('/', asyncWrapper(controller.createApartment));
router.get('/', asyncWrapper(controller.getAllApartments));
router.get('/:id', asyncWrapper(controller.getApartment));
router.patch('/:id', asyncWrapper(controller.updateApartment));
router.delete('/:id', asyncWrapper(controller.deleteApartment));

router.use('/:apartmentId/expenses', ApartmentExpenseRoutes);
router.use('/:apartmentId/charges', ChargeRoutes);
router.use('/:apartmentId/settings', SettingRoutes);

export default router;
