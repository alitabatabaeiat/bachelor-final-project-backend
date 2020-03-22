import {EntityRepository, Repository} from "typeorm";
import ApartmentExpense from "./apartmentExpenses.entity";

@EntityRepository(ApartmentExpense)
class ApartmentExpenseRepository extends Repository<ApartmentExpense> {
}

export default ApartmentExpenseRepository;
