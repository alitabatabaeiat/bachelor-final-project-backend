import {Router} from 'express';
import controller from './expenseTypes.controller';
import {asyncWrapper} from '@utils';

const router = Router();

router.post('/', asyncWrapper(controller.createExpenseType));
router.get('/', asyncWrapper(controller.getAllExpenseTypes));
router.get('/:id', asyncWrapper(controller.getExpenseType));

export default router;
