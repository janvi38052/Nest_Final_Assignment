import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Ticket } from 'src/ticket/ticket.entity';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    paymentId: number;

    @Column()
    paymentMethod: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    createdBy: number;

    @Column()
    updatedBy: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => Ticket, ticket => ticket.payments)  
    @JoinColumn({ name: 'ticketId' })  
    ticket: Ticket; 
}
