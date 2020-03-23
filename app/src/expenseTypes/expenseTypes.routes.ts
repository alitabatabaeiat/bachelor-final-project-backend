import {Router} from 'express';
import controller from './expenseTypes.controller';
import {asyncWrapper} from '@utils';

const router = Router();

router.post('/', asyncWrapper(controller.createExpenseType));

export default router;
