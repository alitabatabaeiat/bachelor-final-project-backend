import {Router} from 'express';
import * as controller from './users.controller';
import {asyncWrapper} from '@utils';

const router = Router();

router.post('/sign-up', asyncWrapper(controller.signUp));
router.post('/sign-in', asyncWrapper(controller.signIn));

export default router;
