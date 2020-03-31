import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import ExpenseType from "./expenseTypes.entity";

@EntityRepository(ExpenseType)
class ExpenseTypeRepository extends Repository<ExpenseType> {
}

const getExpenseTypeRepository = () => getCustomRepository(ExpenseTypeRepository);

export default getExpenseTypeRepository;
