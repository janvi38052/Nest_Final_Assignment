import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { TrainService } from './train.service';
import { CreateTrainDto, UpdateTrainDto } from './train.dto';
import { Train } from './train.entity';

@Controller('trains')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @Post()
  async create(@Body() createTrainDto: CreateTrainDto): Promise<Train> {
    return this.trainService.create(createTrainDto);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'trainName',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Train[]> {
    return this.trainService.findAll(search, page, limit, sortBy, sortOrder);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Train> {
    return this.trainService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTrainDto: UpdateTrainDto): Promise<Train> {
    return this.trainService.update(id, updateTrainDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.trainService.remove(id);
  }

  @Post(':trainId/stations/:stationId')
  async addStationToTrain(@Param('trainId') trainId: number, @Param('stationId') stationId: number): Promise<Train> {
    return this.trainService.addStationToTrain(trainId, stationId);
  }

  @Get(':id/stations')
  async getTrainStations(@Param('id') trainId: number): Promise<Train> {
    return this.trainService.getTrainStations(trainId);
  }
}
