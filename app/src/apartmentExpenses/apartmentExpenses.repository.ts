import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import ApartmentExpense from "./apartmentExpenses.entity";

@EntityRepository(ApartmentExpense)
class ApartmentExpenseRepository extends Repository<ApartmentExpense> {
}

const getApartmentExpenseRepository = () => getCustomRepository(ApartmentExpenseRepository);

export default getApartmentExpenseRepository;
