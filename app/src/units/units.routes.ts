import {Router} from 'express';
import * as controller from './units.controller';
import {asyncWrapper, Upload} from '@utils';
import {UnitChargeRoutes} from "@unitCharges";
import {UnitExpenseRoutes} from "@unitExpenses";

const router = Router();

router.post('/', asyncWrapper(controller.createUnit));
router.post('/excel', Upload.single("file"), asyncWrapper(controller.createMultipleUnits));
router.get('/', asyncWrapper(controller.getAllUnits));
router.get('/excel', asyncWrapper(controller.getExcel));
router.get('/count', asyncWrapper(controller.getUnitsCount));
router.get('/:id', asyncWrapper(controller.getUnit));
router.patch('/:id', asyncWrapper(controller.updateUnit));
router.delete('/:id', asyncWrapper(controller.deleteUnit));

router.use('/:unitId/charges', UnitChargeRoutes);
router.use('/:unitId/expenses', UnitExpenseRoutes);

export default router;
