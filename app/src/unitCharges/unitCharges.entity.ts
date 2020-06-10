import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntity} from "@utils";
import {Unit} from "@units";
import Charge from "../charges/charges.entity";

@Entity('unit_charges')
class UnitCharge extends BaseEntity {
    @Column({name: 'amount', type: 'bigint'})
    public amount: number;

    @ManyToOne(type => Unit, unit => unit.charges, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'unit_id'})
    public unit: Unit;

    @ManyToOne(type => Charge, charge => charge.unitCharges, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'charge_id'})
    public charge: Charge;
}

export default UnitCharge;
