import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

class BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;
}

export default BaseEntity;
