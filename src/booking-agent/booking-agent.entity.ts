import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('BookingAgents')
export class BookingAgent {
    @PrimaryGeneratedColumn()
    bookingAgentId: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    contactNumber?: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    agencyName?: string;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @Column()
    createdBy: number;

    @Column()
    updatedBy: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
