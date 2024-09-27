import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TrainModule } from './train/train.module';
import { BookingModule } from './booking/booking.module';
import { StationModule } from './station/station.module';
import { User } from './user/user.entity';
import { Booking } from './booking/booking.entity';
import { Train } from './train/train.entity';
import { Station } from './station/station.entity';
import { AuthModule } from './auth/auth.module';
import { Ticket } from './ticket/ticket.entity';
import { BookingAgent } from './booking-agent/booking-agent.entity';
import { Cancellation } from './cancellation/cancellation.entity';
import { Payment } from './payment/payment.entity';
import { BookingAgentModule } from './booking-agent/booking-agent.module';
import { CancellationModule } from './cancellation/cancellation.module';
import { PaymentModule } from './payment/payment.module';
import { LoggerModule } from './logger.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'entity',
      entities: [User, Booking , Train, Station,Ticket,BookingAgent,Cancellation,Payment],
      synchronize: false,
    }),
    UserModule,
    TrainModule,
    BookingModule,
    StationModule,
    BookingAgentModule,
    AuthModule,
    CancellationModule,
    PaymentModule,
    LoggerModule,
    TicketModule



  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
