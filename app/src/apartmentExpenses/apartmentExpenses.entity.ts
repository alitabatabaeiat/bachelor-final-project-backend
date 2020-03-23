import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "@utils";
import {Apartment} from "@apartments";
import ExpenseType from "../expenseTypes/expenseTypes.entity";

@Entity('apartment_expenses')
class ApartmentExpense extends BaseEntity {
    @Column({type: 'bigint'})
    public amount: number;

    @Column({length: 256, nullable: true})
    public description: string;

    @Column({name: 'split_option', type: 'smallint'})
    public splitOption: string;

    @Column({name: 'filter_option', type: 'smallint'})
    public filterOption: string;

    @ManyToOne(type => Apartment, apartment => apartment.expenses)
    public apartment: Apartment;

    @ManyToOne(type => ExpenseType, type => type.expenses)
    public type: ExpenseType;
}

export default ApartmentExpense;
