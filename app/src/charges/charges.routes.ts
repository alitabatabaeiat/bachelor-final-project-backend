import {Router} from 'express';
import * as controller from './charges.controller';
import {asyncWrapper} from '@utils';

const router = Router({mergeParams: true});

router.get('/', asyncWrapper(controller.getAllCharges));
router.post('/', asyncWrapper(controller.createCharge));

export default router;
