import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "@utils";
import {Unit} from "@units";
import {ApartmentExpense} from "@apartmentExpenses";

@Entity('apartment_expenses')
class UnitExpense extends BaseEntity {
    @Column({type: 'bigint'})
    public amount: number;

    @ManyToOne(type => Unit, unit => unit.expenses)
    public unit: Unit;

    @ManyToOne(type => ApartmentExpense, apartmentExpense => apartmentExpense.unitExpenses)
    public apartmentExpense: ApartmentExpense;
}

export default UnitExpense;
