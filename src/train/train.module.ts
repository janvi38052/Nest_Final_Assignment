import { Module } from '@nestjs/common';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Train } from './train.entity';
import { Booking } from 'src/booking/booking.entity';
import { Station } from 'src/station/station.entity';


@Module({
  imports : [TypeOrmModule.forFeature([Train , Station , Booking])],
  controllers: [TrainController],
  providers: [TrainService]
})
export class TrainModule {}
