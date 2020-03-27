import {Router} from 'express';
import controller from './apartments.controller';
import {asyncWrapper} from '@utils';
import {ApartmentExpenseRoutes} from "@apartmentExpenses";

const router = Router();

router.post('/', asyncWrapper(controller.createApartment));
router.get('/', asyncWrapper(controller.getAllApartments));
router.get('/:id', asyncWrapper(controller.getApartment));
router.patch('/:id', asyncWrapper(controller.updateApartment));
router.delete('/:id', asyncWrapper(controller.deleteApartment));

router.use('/:apartmentId/expenses', ApartmentExpenseRoutes);

export default router;
