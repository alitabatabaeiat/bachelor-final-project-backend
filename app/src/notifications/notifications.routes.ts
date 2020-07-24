import {Router} from 'express';
import * as controller from './notifications.controller';
import {asyncWrapper} from '@utils';

const router = Router({mergeParams: true});

router.get('/', asyncWrapper(controller.getAllNotifications));
// router.get('/:id', asyncWrapper(controller.getNotification));
router.post('/', asyncWrapper(controller.createNotification));

export default router;
