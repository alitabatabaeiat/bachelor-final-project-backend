import {Router} from 'express';
import * as controller from './unitCharges.controller';
import {asyncWrapper} from '@utils';

const router = Router({mergeParams: true});

router.get('/', asyncWrapper(controller.getAllCharges));

export default router;
