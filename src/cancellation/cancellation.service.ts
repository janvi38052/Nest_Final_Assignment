import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cancellation } from './cancellation.entity';
import { Ticket } from 'src/ticket/ticket.entity';
import { CreateCancellationDto, UpdateCancellationDto } from './cancellation.dto';

@Injectable()
export class CancellationService {
  constructor(
    @InjectRepository(Cancellation)
    private readonly cancellationRepository: Repository<Cancellation>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>, 
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateCancellationDto): Promise<Cancellation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
   
      const ticket = await queryRunner.manager.findOne(Ticket, { where: { ticketId: dto.ticketId } });
      if (!ticket) {
        throw new Error('Ticket not found'); 
      }

      
      const cancellation = queryRunner.manager.create(Cancellation, {
        ...dto,
        ticket, 
      });
      const savedCancellation = await queryRunner.manager.save(cancellation);
      await queryRunner.commitTransaction();
      return savedCancellation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    ticketId?: number, 
  ): Promise<{ data: Cancellation[]; totalRecords: number; totalPages: number; currentPage: number }> {
    const validSortColumns = ['reason', 'createdBy', 'updatedBy', 'cancellationDate'];

    if (!validSortColumns.includes(sortBy)) {
      sortBy = 'reason';
    }

    const query = this.cancellationRepository.createQueryBuilder('cancellation');

    if (search) {
      query.where('cancellation.reason LIKE :search', { search: `%${search}%` });
    }

    if (ticketId) {
      query.andWhere('cancellation.ticketId = :ticketId', { ticketId });
    }

    query.orderBy(`cancellation.${sortBy}`, sortOrder);

    // Pagination
    const offset = (page - 1) * limit;
    query.skip(offset).take(limit);

    const [data, totalRecords] = await query.getManyAndCount();

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data,
      totalRecords,
      totalPages,
      currentPage: page,
    };
  }

  async findOne(id: number): Promise<Cancellation> {
    return this.cancellationRepository.findOne({ where: { cancellationId: id }, relations: ['ticket'] }); // Include relations if needed
  }

  async update(id: number, dto: UpdateCancellationDto): Promise<Cancellation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Cancellation, id, dto);
      const updatedCancellation = await queryRunner.manager.findOne(Cancellation, { where: { cancellationId: id }, relations: ['ticket'] });
      await queryRunner.commitTransaction();
      return updatedCancellation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Cancellation, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
