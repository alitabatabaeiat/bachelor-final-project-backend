import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

class BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn({name: 'created_at', select: false})
    public createdAt: Date;

    @UpdateDateColumn({name: 'updated_at', select: false})
    public updatedAt: Date;
}

export default BaseEntity;
