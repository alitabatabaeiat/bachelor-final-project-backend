import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import {BaseEntity} from "@utils";
import {User} from "@users";
import Apartment from "../apartments/apartments.entity";
import {UnitExpense} from "@unitExpenses";
import {UnitCharge} from "@unitCharges";

@Entity('units')
class Unit extends BaseEntity {
    @Column({length: 30})
    public title: string;

    @Column({type: 'smallint'})
    public floor: number;

    @Column({type: 'smallint'})
    public area: number;

    @Column({name: 'parking_space_count', type: 'smallint'})
    public parkingSpaceCount: number;

    @Column({name: 'resident_count', type: 'smallint', nullable: true})
    public residentCount: number;

    @Column({name: 'fixed_charge', type: 'bigint', default: 0})
    public fixedCharge: number;

    @Column({name: 'power_consumption', type: 'bigint', default: 0})
    public powerConsumption: number;

    @Column({name: 'suggested_consumption_coefficient', type: 'float', nullable: true})
    public suggestedConsumptionCoefficient: number;

    @Column({name: 'is_empty'})
    public isEmpty: boolean;

    @ManyToOne(type => Apartment, apartment => apartment.units, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'apartment_id'})
    public apartment: Apartment;

    @ManyToOne(type => User, user => user.units)
    @JoinColumn({name: 'resident_id'})
    public resident: User;

    @OneToMany(type => UnitExpense, unitExpense => unitExpense.unit)
    public expenses: UnitExpense[];

    @OneToMany(type => UnitCharge, unitCharge => unitCharge.unit)
    public charges: UnitCharge[];
}

export default Unit;
