import {Column, Entity, JoinColumn, ManyToOne, RelationId} from "typeorm";
import {BaseEntity} from "@utils";
import {Unit} from "@units";
import {ApartmentExpense} from "@apartmentExpenses";
import {UnitCharge} from "@unitCharges";

@Entity('unit_expenses')
class UnitExpense extends BaseEntity {
    @Column({type: 'bigint'})
    public amount: number;

    @ManyToOne(type => Unit, unit => unit.expenses)
    public unit: Unit;

    @RelationId((unitExpense: UnitExpense) => unitExpense.unit)
    unitId: number;

    @ManyToOne(type => ApartmentExpense, apartmentExpense => apartmentExpense.unitExpenses)
    public apartmentExpense: ApartmentExpense;
    //
    // @ManyToOne(type => UnitCharge, unitCharge => unitCharge.expenses)
    // @JoinColumn({name: 'unit_charge_id'})
    // public unitCharge: UnitCharge;
}

export default UnitExpense;
