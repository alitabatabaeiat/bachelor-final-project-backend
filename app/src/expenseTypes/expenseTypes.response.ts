import _ from "lodash";
import ExpenseType from "./expenseTypes.entity";

const createExpenseType = (expenseType) : ExpenseType => {
    return {
        ..._.pick(expenseType, ['id', 'title', 'color', 'createdAt'])
    } as ExpenseType;
};

export default {
    createExpenseType
}
