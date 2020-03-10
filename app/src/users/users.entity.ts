import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "@utils";
import bcrypt from "bcryptjs";

@Entity('users')
class User extends BaseEntity {
    @Column({ name: 'first_name', length: 20 })
    public firstName: string;

    @Column({ name: 'last_name', length: 20 })
    public lastName: string;

    @Column({ name: 'mobile_number', length: 10, unique: true })
    public mobileNumber: string;

    @Column({ length: 256 })
    public password: string;

    constructor(user) {
        super();
        if (user) {
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.mobileNumber = user.mobileNumber;
            this.password = user.password;
        }
    }

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    isPasswordValid(password: string) {
        return bcrypt.compareSync(password, this.password);
    }
}

export default User;
