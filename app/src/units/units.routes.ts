import {Router} from 'express';
import controller from './units.controller';
import {asyncWrapper} from '@utils';
import {UnitChargeRoutes} from "@unitCharges";
import {UnitExpenseRoutes} from "@unitExpenses";

const router = Router();

router.post('/', asyncWrapper(controller.createUnit));
router.get('/', asyncWrapper(controller.getAllUnits));
router.get('/:id', asyncWrapper(controller.getUnit));
router.patch('/:id', asyncWrapper(controller.updateUnit));
router.delete('/:id', asyncWrapper(controller.deleteUnit));

router.use('/:unitId/charges', UnitChargeRoutes);
router.use('/:unitId/expenses', UnitExpenseRoutes);

export default router;
