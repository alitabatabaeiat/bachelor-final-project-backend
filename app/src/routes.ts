import {Router} from 'express';
import { routes as usersRoutes } from '@users';
import { routes as apartmentsRoutes } from '@apartments';
import { routes as unitRoutes } from '@units';
import { ChargeRoutes } from '@charges';
import { ExpenseTypeRoutes } from "@expenseTypes";
import {authenticationMiddleware} from "@middleware";

const router = Router();

router.use('/users', usersRoutes);
router.use('/manager/apartments', authenticationMiddleware(), apartmentsRoutes);
router.use(['/manager/units', '/resident/units'], authenticationMiddleware(), unitRoutes);
router.use('/manager/expenseTypes', authenticationMiddleware(), ExpenseTypeRoutes);
router.use('/manager/charges', authenticationMiddleware(), ChargeRoutes);

export default router;
