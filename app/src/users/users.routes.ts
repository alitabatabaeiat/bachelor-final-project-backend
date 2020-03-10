import {Router} from 'express';
import controller from './users.controller';
import {asyncWrapper} from '@utils';

const router = Router();

router.post('/sign-up', asyncWrapper(controller.signUp));

export default router;
