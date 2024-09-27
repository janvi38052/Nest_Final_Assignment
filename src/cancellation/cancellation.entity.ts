import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Ticket } from 'src/ticket/ticket.entity';

@Entity()
export class Cancellation {
    @PrimaryGeneratedColumn()
    cancellationId: number;

    @Column()
    cancellationDate: Date;

    @Column({ nullable: true })
    reason: string;

    @Column({ type: 'datetime', nullable: true })
    deletedAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    createdBy: number;

    @Column()
    updatedBy: number;

    @ManyToOne(() => Ticket, ticket => ticket.cancellations)
    @JoinColumn({ name: 'ticketId' })
    ticket: Ticket; 
}
