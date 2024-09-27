import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';
import { Ticket } from 'src/ticket/ticket.entity'; 

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>, 

    private readonly dataSource: DataSource,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); 

    try {
      const ticket = await this.ticketRepository.findOne({ where: { ticketId: createPaymentDto.ticketId } });
      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${createPaymentDto.ticketId} not found`);
      }

      const payment = queryRunner.manager.create(Payment, { ...createPaymentDto, ticket });
      const savedPayment = await queryRunner.manager.save(payment);
      await queryRunner.commitTransaction(); 
      return savedPayment;
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
  ): Promise<{ data: Payment[]; totalRecords: number; totalPages: number; currentPage: number }> {
    const validSortColumns = ['amount', 'paymentMethod', 'createdAt', 'updatedAt']; 

    if (!validSortColumns.includes(sortBy)) {
      sortBy = 'amount';
    }

    const query = this.paymentRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.ticket', 'ticket'); 

    if (search) {
      query.where('payment.amount LIKE :search OR payment.paymentMethod LIKE :search', {
        search: `%${search}%`,
      });
    }

    // Sorting
    query.orderBy(`payment.${sortBy}`, sortOrder);

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

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentId: id },
      relations: ['ticket'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); 

    try {
      const payment = await this.findOne(id); 
      Object.assign(payment, updatePaymentDto); 
      const updatedPayment = await queryRunner.manager.save(payment);
      await queryRunner.commitTransaction();
      return updatedPayment;
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
      const result = await queryRunner.manager.delete(Payment, id);
      if (result.affected === 0) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
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
