import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Train } from "src/train/train.entity";

@Entity()
export class Station {
    @PrimaryGeneratedColumn()
    stationId: number;

    @Column()
    stationName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @Column()
    createdBy: number;

    @Column()
    updatedBy: number;

    @ManyToMany(() => Train, train => train.stations)
    @JoinTable()
    trains: Train[];
}
