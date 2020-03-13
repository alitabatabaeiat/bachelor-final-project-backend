import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntity} from "@utils";
import {User} from "@users";
import Apartment from "../apartments/apartments.entity";

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

    @Column({name: 'resident_count', type: 'smallint'})
    public residentCount: number;

    @Column({name: 'fixed_charge', type: 'bigint', default: 0})
    public fixedCharge: number;

    @Column({name: 'is_empty'})
    public isEmpty: boolean;

    @ManyToOne(type => Apartment, apartment => apartment.units, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'apartment_id'})
    public apartment: Apartment;

    @ManyToOne(type => User, user => user.units)
    @JoinColumn({name: 'resident_id'})
    public resident: User;

    constructor(unit) {
        super();
        if (unit) {
            this.title = unit.title;
            this.floor = unit.floor;
            this.area = unit.area;
            this.parkingSpaceCount = unit.parkingSpaceCount;
            this.residentCount = unit.residentCount;
            this.fixedCharge = unit.fixedCharge;
            this.isEmpty = unit.isEmpty;
            this.apartment = unit.apartment;
            this.resident = unit.resident;
        }
    }
}

export default Unit;
