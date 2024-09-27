import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Train } from 'src/train/train.entity'; 

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    bookingId: number;

    @Column()
    bookingDate: Date;

    @ManyToOne(() => Train, train => train.bookings, {
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ name: 'trainId' }) 
    train: Train; 

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
