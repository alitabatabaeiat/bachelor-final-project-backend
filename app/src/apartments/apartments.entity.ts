import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import {BaseEntity} from "@utils";
import {User} from "@users";
import {Unit} from "@units";

@Entity('apartments')
class Apartment extends BaseEntity {
    @Column({length: 25})
    public title: string;

    @Column({length: 20})
    public city: string;

    @Column({length: 100})
    public address: string;

    @ManyToOne(type => User, user => user.apartments, {nullable: false})
    @JoinColumn({name: 'manager_id'})
    public manager: User;

    @OneToMany(type => Unit, unit => unit.apartment)
    public units: Unit[];

    constructor(apartment) {
        super();
        if (apartment) {
            this.title = apartment.title;
            this.city = apartment.city;
            this.address = apartment.address;
            this.manager = apartment.manager;
        }
    }
}

export default Apartment;
