import {Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId} from "typeorm";
import {BaseEntity} from "@utils";
import {Apartment} from "@apartments";
import {ApartmentExpense} from "@apartmentExpenses";
import {UnitCharge} from "@unitCharges";

@Entity('charges')
class Charge extends BaseEntity {
    @Column({length: 30})
    public title: string;

    @Column({name: 'payment_deadline', type: 'smallint', nullable: true})
    public paymentDeadline: number;

    @Column({name: 'total_amount', type: 'bigint'})
    public totalAmount: number;

    @Column({name: 'delay_penalty', type: 'bigint', nullable: true})
    public delayPenalty: number;

    @Column({name: 'include_fixed_Charge'})
    public includeFixedCharge: boolean;

    @Column({name: 'description', type: 'text', nullable: true})
    public description: string;

    @ManyToOne(type => Apartment, apartment => apartment.charges, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'apartment_id'})
    public apartment: Apartment;

    @OneToMany(type => ApartmentExpense, apartmentExpense => apartmentExpense.charge)
    public expenses: ApartmentExpense[];

    @RelationId((charge: Charge) => charge.expenses)
    public expensesId: number[];

    @OneToMany(type => UnitCharge, unitCharge => unitCharge.charge)
    public unitCharges: UnitCharge[];
}

export default Charge;
