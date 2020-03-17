import {Router} from 'express';
import controller from './units.controller';
import {asyncWrapper} from '@utils';

const router = Router({mergeParams: true});

router.post('/', asyncWrapper(controller.createUnit));
router.get('/:id', asyncWrapper(controller.getUnit));
router.delete('/:id', asyncWrapper(controller.deleteUnit));

export default router;
