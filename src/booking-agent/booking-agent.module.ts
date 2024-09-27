import { Module } from '@nestjs/common';
import { BookingAgentService } from './booking-agent.service';
import { BookingAgentController } from './booking-agent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingAgent } from './booking-agent.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BookingAgent])],
  providers: [BookingAgentService],
  controllers: [BookingAgentController]
})
export class BookingAgentModule {}
