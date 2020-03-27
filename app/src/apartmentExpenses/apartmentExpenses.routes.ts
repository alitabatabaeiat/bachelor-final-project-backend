import {Router} from 'express';
import controller from './apartmentExpenses.controller';
import {asyncWrapper} from '@utils';

const router = Router({mergeParams: true});

router.post('/', asyncWrapper(controller.createApartmentExpense));
router.get('/', asyncWrapper(controller.getAllApartmentExpenses));

router.get('/options', asyncWrapper(controller.getOptions));

export default router;
