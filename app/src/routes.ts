import {Router} from 'express';
import { routes as usersRoutes } from '@users';

const router = Router();

router.use('/users', usersRoutes);

export default router;
