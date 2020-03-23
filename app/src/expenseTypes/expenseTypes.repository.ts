import {EntityRepository, Repository} from "typeorm";
import ExpenseType from "./expenseTypes.entity";

@EntityRepository(ExpenseType)
class ExpenseTypeRepository extends Repository<ExpenseType> {
}

export default ExpenseTypeRepository;
