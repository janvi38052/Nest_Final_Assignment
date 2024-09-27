import { DataSource } from 'typeorm';
import { User } from './user/user.entity'; 
import { Train } from './train/train.entity';
import { Station } from './station/station.entity';
import { Booking } from './booking/booking.entity';
import { Ticket } from './ticket/ticket.entity';
import { BookingAgent } from './booking-agent/booking-agent.entity';
import { Cancellation } from './cancellation/cancellation.entity';
import { Payment } from './payment/payment.entity';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",          
    password: "admin",         
    database: "entity",           
    entities: [User,Booking, Train, Station ,Ticket,BookingAgent,Cancellation,Payment],
    migrations: ["src/migrations/*.ts"],  
    synchronize: false,  
    logging: true,       
});
