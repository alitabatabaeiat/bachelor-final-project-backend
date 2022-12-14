import {Router} from 'express';
import { routes as usersRoutes } from '@users';
import { routes as apartmentsRoutes } from '@apartments';
import { routes as unitRoutes } from '@units';
import { ExpenseTypeRoutes } from "@expenseTypes";
import {authenticationMiddleware} from "@middleware";
import {NotificationRoutes} from "./notifications";

const router = Router();

router.use('/users', usersRoutes);
router.use('/manager/apartments', authenticationMiddleware(), apartmentsRoutes);
router.use(['/manager', '/resident'].map(r => r + '/units'), authenticationMiddleware(), unitRoutes);
router.use('/manager/expenseTypes', authenticationMiddleware(), ExpenseTypeRoutes);
router.use(['/manager', '/resident'].map(r => r + '/notifications'), authenticationMiddleware(), NotificationRoutes);

export default router;
