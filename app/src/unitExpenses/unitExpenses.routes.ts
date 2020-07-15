import {Router} from 'express';
import * as controller from './unitExpenses.controller';
import {asyncWrapper} from '@utils';

const router = Router({mergeParams: true});

router.get('/', asyncWrapper(controller.getAllExpenses));

export default router;
