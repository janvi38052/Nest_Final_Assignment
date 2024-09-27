import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BookingAgent } from './booking-agent.entity';
import { CreateBookingAgentDto, UpdateBookingAgentDto } from './booking-agent.dto';

@Injectable()
export class BookingAgentService {
  constructor(
    @InjectRepository(BookingAgent)
    private readonly bookingAgentRepository: Repository<BookingAgent>,
    private readonly dataSource: DataSource, 
  ) {}

  async create(createBookingAgentDto: CreateBookingAgentDto): Promise<BookingAgent> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); 

    try {
      const bookingAgent = queryRunner.manager.create(BookingAgent, createBookingAgentDto);
      const savedBookingAgent = await queryRunner.manager.save(bookingAgent);
      await queryRunner.commitTransaction(); 
      return savedBookingAgent;
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
  ): Promise<{ data: BookingAgent[]; totalRecords: number; totalPages: number; currentPage: number }> {
    const validSortColumns = ['name', 'email', 'createdAt', 'updatedAt']; 

    if (!validSortColumns.includes(sortBy)) {
      sortBy = 'name';
    }

    const query = this.bookingAgentRepository.createQueryBuilder('bookingAgent');

    if (search) {
      query.where('bookingAgent.name LIKE :search OR bookingAgent.email LIKE :search', {
        search: `%${search}%`,
      });
    }

    // Sorting
    query.orderBy(`bookingAgent.${sortBy}`, sortOrder);

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

  async findOne(id: number): Promise<BookingAgent> {
    const bookingAgent = await this.bookingAgentRepository.findOne({ where: { bookingAgentId: id } });
    if (!bookingAgent) {
      throw new NotFoundException(`BookingAgent with ID ${id} not found`);
    }
    return bookingAgent;
  }

  async update(id: number, updateBookingAgentDto: UpdateBookingAgentDto): Promise<BookingAgent> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); 

    try {
      const bookingAgent = await this.findOne(id);
      Object.assign(bookingAgent, updateBookingAgentDto); 
      const updatedBookingAgent = await queryRunner.manager.save(bookingAgent);
      await queryRunner.commitTransaction(); 
      return updatedBookingAgent;
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
      const result = await queryRunner.manager.delete(BookingAgent, id);
      if (result.affected === 0) {
        throw new NotFoundException(`BookingAgent with ID ${id} not found`);
      }
      await queryRunner.commitTransaction(); 
    } catch (error) {
      await queryRunner.rollbackTransaction(); 
      throw error; 
    } finally {
      await queryRunner.release(); 
    }
  }
}
