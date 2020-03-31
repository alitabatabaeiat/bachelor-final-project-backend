import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import UnitExpense from "./unitExpenses.entity";

@EntityRepository(UnitExpense)
class UnitExpenseRepository extends Repository<UnitExpense> {
}

const getUnitExpenseRepository = () => getCustomRepository(UnitExpenseRepository);

export default getUnitExpenseRepository;
