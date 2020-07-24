import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntity} from "@utils";
import {Apartment} from "@apartments";
import {User} from "@users";

@Entity('notifications')
class AppNotification extends BaseEntity {
    @Column({length: 30})
    public title: string;

    @Column({name: 'body', type: 'text'})
    public body: string;

    @ManyToOne(type => Apartment, apartment => apartment.notifications, {onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'apartment_id'})
    public apartment: Apartment;

    @ManyToOne(type => User,{onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'user_id'})
    public sender: User;
}

export default AppNotification;
