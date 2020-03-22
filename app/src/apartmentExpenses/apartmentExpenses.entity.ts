import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "@utils";
import {Apartment} from "@apartments";

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
}

export default ApartmentExpense;
