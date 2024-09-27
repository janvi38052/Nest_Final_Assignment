import { Module } from '@nestjs/common';
import { CancellationService } from './cancellation.service';
import { CancellationController } from './cancellation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cancellation } from './cancellation.entity';
import { Ticket } from 'src/ticket/ticket.entity';
@Module({
  imports:[TypeOrmModule.forFeature([Cancellation,Ticket])],
  providers: [CancellationService],
  controllers: [CancellationController]
})
export class CancellationModule {}
