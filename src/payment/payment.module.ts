import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Ticket } from 'src/ticket/ticket.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Payment,Ticket])],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
