import {Router} from 'express';
import controller from './units.controller';
import {asyncWrapper} from '@utils';

const router = Router();

router.post('/', asyncWrapper(controller.createUnit));
router.get('/', asyncWrapper(controller.getAllUnits));
router.get('/:id', asyncWrapper(controller.getUnit));
router.patch('/:id', asyncWrapper(controller.updateUnit));
router.delete('/:id', asyncWrapper(controller.deleteUnit));

export default router;
