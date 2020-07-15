import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import {BaseEntity} from "@utils";
import {Unit} from "@units";
import Charge from "../charges/charges.entity";
import UnitExpense from "../unitExpenses/unitExpenses.entity";

@Entity('unit_charges')
class UnitCharge extends BaseEntity {
    @Column({name: 'amount', type: 'bigint'})
    public amount: number;

    @Column({name: 'is_paid', default: false})
    public isPaid: boolean;

    @ManyToOne(type => Unit, unit => unit.charges, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'unit_id'})
    public unit: Unit;

    @ManyToOne(type => Charge, charge => charge.unitCharges, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'charge_id'})
    public charge: Charge;
    //
    // @OneToMany(type => UnitExpense, unitExpense => unitExpense.unitCharge)
    // public expenses: UnitExpense[];
}

export default UnitCharge;
