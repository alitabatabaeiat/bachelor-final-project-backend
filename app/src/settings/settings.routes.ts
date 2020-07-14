import {Router} from 'express';
import * as controller from './settings.controller';
import {asyncWrapper} from '@utils';

const router = Router({mergeParams: true});

router.get('/', asyncWrapper(controller.getApartmentSetting));
router.patch('/', asyncWrapper(controller.updateApartmentSetting));

export default router;
