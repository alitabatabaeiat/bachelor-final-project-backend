import {EntityRepository, Repository} from "typeorm";
import UnitExpense from "./unitExpenses.entity";

@EntityRepository(UnitExpense)
class UnitExpenseRepository extends Repository<UnitExpense> {
}

export default UnitExpenseRepository;
