import {Router} from 'express';
import { routes as usersRoutes } from '@users';
import { routes as apartmentsRoutes } from '@apartments';
import {authenticationMiddleware} from "@middleware";

const router = Router();

router.use('/users', usersRoutes);
router.use('/apartments', authenticationMiddleware(), apartmentsRoutes);

export default router;
