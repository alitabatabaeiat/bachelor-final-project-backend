import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "@utils";
import {Apartment} from "@apartments";
import ExpenseType from "../expenseTypes/expenseTypes.entity";
import {UnitExpense} from "@unitExpenses";

@Entity('apartment_expenses')
class ApartmentExpense extends BaseEntity {
    @Column({type: 'bigint'})
    public amount: number;

    @Column({length: 256, nullable: true})
    public description: string;

    @Column({name: 'split_option', type: 'smallint'})
    public splitOption: number;

    @Column({name: 'filter_option', type: 'smallint'})
    public filterOption: number;

    @Column({name: 'is_declared', default: false})
    public isDeclared: boolean;

    @ManyToOne(type => Apartment, apartment => apartment.expenses)
    public apartment: Apartment;

    @ManyToOne(type => ExpenseType, type => type.expenses)
    public type: ExpenseType;

    @ManyToOne(type => UnitExpense, unitExpense => unitExpense.apartmentExpense)
    public unitExpenses: UnitExpense[];
}

export default ApartmentExpense;
