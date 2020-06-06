import _ from "lodash";
import ApartmentExpense from "./apartmentExpenses.entity";

const createApartmentExpense = (apartmentExpense, type) : ApartmentExpense => {
    return {
        ..._.pick(apartmentExpense, ['id', 'amount', 'description', 'filterOption', 'splitOption', 'isDeclared', 'createdAt']),
        type
    } as ApartmentExpense;
};

export default {
    createApartmentExpense
}
