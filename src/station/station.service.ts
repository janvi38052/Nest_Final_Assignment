import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, Like } from 'typeorm';  // Import Like here
import { Station } from './station.entity';
import { CreateStationDto, UpdateStationDto } from './station.dto';
import { Train } from 'src/train/train.entity';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    
    @InjectRepository(Train)
    private readonly trainRepository: Repository<Train>,

    private readonly dataSource: DataSource, 
  ) {}

  async create(createStationDto: CreateStationDto): Promise<Station> {
    const { stationName, trainIds } = createStationDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const newStation = this.stationRepository.create({ stationName });

      if (trainIds && trainIds.length > 0) {
        const trains = await this.trainRepository.findByIds(trainIds);
        newStation.trains = trains;
      }

      await queryRunner.manager.save(newStation);
      await queryRunner.commitTransaction();

      return newStation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
    sortBy: string = 'stationId',
    order: 'ASC' | 'DESC' = 'ASC'
  ): Promise<{ data: Station[]; total: number }> {
    const [result, total] = await this.stationRepository.findAndCount({
      where: {
        stationName: searchTerm ? Like(`%${searchTerm}%`) : undefined,
      },
      relations: ['trains'],
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [sortBy]: order,
      },
    });

    return {
      data: result,
      total,
    };
  }

  async findOne(stationId: number): Promise<Station> {
    const station = await this.stationRepository.findOne({
      where: { stationId },
      relations: ['trains'],
    });
    if (!station) {
      throw new NotFoundException(`Station with ID ${stationId} not found`);
    }
    return station;
  }

  async update(stationId: number, updateStationDto: UpdateStationDto): Promise<void> {
    const { trainIds, ...updateData } = updateStationDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Station, stationId, updateData);

      if (trainIds) {
        const station = await queryRunner.manager.findOne(Station, {
          where: { stationId },
          relations: ['trains'],
        });
        if (station) {
          const trains = await this.trainRepository.findByIds(trainIds);
          station.trains = trains;
          await queryRunner.manager.save(station);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(stationId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Station, stationId);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
