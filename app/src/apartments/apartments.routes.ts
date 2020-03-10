import {Router} from 'express';
import controller from './apartments.controller';
import {asyncWrapper} from '@utils';

const router = Router();

router.post('/', asyncWrapper(controller.createApartment));
router.get('/:id', asyncWrapper(controller.getApartment));

export default router;
