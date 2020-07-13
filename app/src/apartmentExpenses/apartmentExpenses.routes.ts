import {Router} from 'express';
import * as controller from './apartmentExpenses.controller';
import {asyncWrapper} from '@utils';

const router = Router({mergeParams: true});

router.post('/', asyncWrapper(controller.createApartmentExpense));
router.post('/calculate', asyncWrapper(controller.getCalculatedExpenses));
router.get('/', asyncWrapper(controller.getAllApartmentExpenses));

router.get('/options', asyncWrapper(controller.getOptions));

export default router;
