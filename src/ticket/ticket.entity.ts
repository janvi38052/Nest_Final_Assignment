import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cancellation } from 'src/cancellation/cancellation.entity';
import { Payment } from 'src/payment/payment.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  ticketId: number;

  @Column()
  startTime: Date;

  @Column()
  source: string;

  @Column()
  destination: string;

  @Column('decimal')
  amount: number;

  @Column('int')
  noOfSeats: number;

  @Column()
  dateTime: Date;

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

  @OneToMany(() => Cancellation, cancellation => cancellation.ticket)
  cancellations: Cancellation[];

  @OneToMany(() => Payment, payment => payment.ticket) 
  payments: Payment[];
}
