import { Module } from '@nestjs/common';
import { StationController } from './station.controller';
import { StationService } from './station.service';
import { Station } from './station.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Train } from 'src/train/train.entity';
@Module({
  imports : [TypeOrmModule.forFeature([Station , Train])],
  controllers: [StationController],
  providers: [StationService]
})
export class StationModule {}
