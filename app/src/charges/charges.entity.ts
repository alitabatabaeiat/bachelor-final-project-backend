import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import {BaseEntity} from "@utils";
import {Apartment} from "@apartments";
import {ApartmentExpense} from "@apartmentExpenses";
import {UnitCharge} from "@unitCharges";

@Entity('charges')
class Charge extends BaseEntity {
    @Column({length: 30})
    public title: string;

    @Column({type: 'smallint', nullable: true})
    public paymentDeadline: number;

    @Column({name: 'delay_penalty', type: 'bigint', nullable: true})
    public delayPenalty: number;

    @Column({name: 'include_fixed_Charge'})
    public includeFixedCharge: boolean;

    @ManyToOne(type => Apartment, apartment => apartment.charges, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'apartment_id'})
    public apartment: Apartment;

    @OneToMany(type => ApartmentExpense, apartmentExpense => apartmentExpense.charge)
    public expenses: ApartmentExpense[];

    @OneToMany(type => UnitCharge, unitCharge => unitCharge.charge)
    public unitCharges: UnitCharge[];
}

export default Charge;
