import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseEntity} from "@utils";
import {User} from "@users";
import {ApartmentExpense} from "@apartmentExpenses";

@Entity('expense_types')
class ExpenseType extends BaseEntity {
    @Column({length: 25})
    public title: string;

    @Column({length: 6})
    public color: string;

    @ManyToOne(type => User, user => user.expenseTypes)
    public owner: User;

    @OneToMany(type => ApartmentExpense, expense => expense.type)
    public expenses: ApartmentExpense[];
}

export default ExpenseType;
