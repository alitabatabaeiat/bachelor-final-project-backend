import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {BaseEntity} from "@utils";
import {Apartment} from "@apartments";

@Entity('settings')
class Setting extends BaseEntity {
    @Column({name: 'resident_count_step', type: 'float', default: 1})
    public residentCountStep: number;

    @Column({name: 'parking_space_count_step', type: 'float', default: 1})
    public parkingSpaceCountStep: number;

    @Column({name: 'floor_step', type: 'float', default: 1})
    public floorStep: number;

    @Column({name: 'area_step', type: 'float', default: 1})
    public areaStep: number;

    @OneToOne(type => Apartment, apartment => apartment.setting, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'apartment_id'})
    public apartment: Apartment;
}

export default Setting;
