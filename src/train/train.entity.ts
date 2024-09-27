import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Booking } from "src/booking/booking.entity";
import { Station } from "src/station/station.entity";

@Entity()
export class Train {
    @PrimaryGeneratedColumn()
    trainId: number;

    @Column()
    trainName: string;

    @Column()
    trainNumber: string;

    @ManyToMany(() => Station, station => station.trains, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinTable({
        name: 'train_stations',  
        joinColumn: {
            name: 'trainId',      
            referencedColumnName: 'trainId'
        },
        inverseJoinColumn: {
            name: 'stationId',    
            referencedColumnName: 'stationId'
        }
    })
    stations: Station[];

    @OneToMany(() => Booking, booking => booking.train) 
    bookings: Booking[];

    @Column({ nullable: true })
    createdBy: number;

    @Column({ nullable: true })
    updatedBy: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
