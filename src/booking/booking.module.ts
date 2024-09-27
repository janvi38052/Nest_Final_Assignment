import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Train } from 'src/train/train.entity';

@Module({    
  imports : [TypeOrmModule.forFeature([Booking,Train])],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}

