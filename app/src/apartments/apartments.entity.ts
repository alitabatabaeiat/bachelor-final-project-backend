import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from "typeorm";
import {BaseEntity} from "@utils";
import {User} from "@users";
import {Unit} from "@units";
import {ApartmentExpense} from "@apartmentExpenses";
import {Charge} from "@charges";
import {Setting} from "../settings";
import {AppNotification} from "../notifications";

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

    @OneToMany(type => ApartmentExpense,
            apartmentExpense => apartmentExpense.apartment)
    public expenses: ApartmentExpense[];

    @OneToMany(type => Charge, charge => charge.apartment)
    public charges: Charge[];

    @OneToMany(type => AppNotification, notification => notification.apartment)
    public notifications: AppNotification[];

    @OneToOne(type => Setting, setting => setting.apartment)
    public setting: Setting;
}

export default Apartment;
