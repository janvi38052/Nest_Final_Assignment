import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, Like } from 'typeorm';
import { Train } from './train.entity';
import { CreateTrainDto, UpdateTrainDto } from './train.dto';
import { Station } from 'src/station/station.entity';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private readonly trainRepository: Repository<Train>,

    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createTrainDto: CreateTrainDto): Promise<Train> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newTrain = this.trainRepository.create({
        trainName: createTrainDto.trainName,
        trainNumber: createTrainDto.trainNumber,
        stations: [],
      });

      if (createTrainDto.stationIds && createTrainDto.stationIds.length > 0) {
        const stations = await this.stationRepository.findBy({
          stationId: In(createTrainDto.stationIds),
        });
        newTrain.stations = stations;
      }

      await queryRunner.manager.save(newTrain);
      await queryRunner.commitTransaction();
      return newTrain;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create train: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'trainName',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Train[]> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.trainRepository.createQueryBuilder('train')
      .leftJoinAndSelect('train.stations', 'station')
      .orderBy(`train.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit);

    if (search) {
      queryBuilder.where('train.trainName LIKE :search', { search: `%${search}%` })
        .orWhere('train.trainNumber LIKE :search', { search: `%${search}%` });
    }

    return queryBuilder.getMany();
  }

  async findOne(trainId: number): Promise<Train> {
    const train = await this.trainRepository.findOne({
      where: { trainId },
      relations: ['stations'],
    });

    if (!train) {
      throw new NotFoundException('Train not found');
    }
    return train;
  }

  async update(trainId: number, updateTrainDto: UpdateTrainDto): Promise<Train> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const train = await this.findOne(trainId);
      Object.assign(train, updateTrainDto);

      if (updateTrainDto.stationIds && updateTrainDto.stationIds.length > 0) {
        const stations = await this.stationRepository.findBy({
          stationId: In(updateTrainDto.stationIds),
        });
        train.stations = stations;
      }

      await queryRunner.manager.save(train);
      await queryRunner.commitTransaction();
      return train;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to update train: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(trainId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const train = await this.findOne(trainId);
      await queryRunner.manager.delete(Train, train.trainId);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to remove train: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async addStationToTrain(trainId: number, stationId: number): Promise<Train> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const train = await this.findOne(trainId);
      const station = await this.stationRepository.findOne({ where: { stationId } });

      if (!station) {
        throw new NotFoundException('Station not found');
      }

      if (!train.stations.some(s => s.stationId === station.stationId)) {
        train.stations.push(station);
        await queryRunner.manager.save(train);
        await queryRunner.commitTransaction();
        return train;
      }

      throw new InternalServerErrorException('Station is already linked to this train');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to link station to train: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getTrainStations(trainId: number): Promise<Train> {
    const trainWithStations = await this.dataSource
      .createQueryBuilder()
      .select('train')
      .from(Train, 'train')
      .leftJoinAndSelect('train.stations', 'station')
      .where('train.trainId = :trainId', { trainId })
      .getOne();

    if (!trainWithStations) {
      throw new NotFoundException('Train not found');
    }

    return trainWithStations;
  }
}
