import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { Cancellation } from 'src/cancellation/cancellation.entity';
import { Payment } from 'src/payment/payment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Ticket,Cancellation,Payment])],
  providers: [TicketService],
  controllers: [TicketController]
})
export class TicketModule {}
