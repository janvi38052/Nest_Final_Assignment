import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto, UpdateTicketDto } from './ticket.dto';
import { Payment } from 'src/payment/payment.entity';
import { Cancellation } from 'src/cancellation/cancellation.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Cancellation)
    private readonly cancellationRepository: Repository<Cancellation>,

    private readonly dataSource: DataSource,
  ) {}

  // Create a new ticket with payments and cancellations (if any)
  async create(dto: CreateTicketDto): Promise<Ticket> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ticket = queryRunner.manager.create(Ticket, dto);
      const savedTicket = await queryRunner.manager.save(ticket);
      await queryRunner.commitTransaction();
      return savedTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Fetch all tickets with pagination, search, and sorting
  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sort: 'asc' | 'desc' = 'asc',
  ): Promise<{ data: Ticket[]; total: number }> {
    const [result, total] = await this.ticketRepository.findAndCount({
      where: [
        { source: search ? Like(`%${search}%`) : undefined },
        { destination: search ? Like(`%${search}%`) : undefined },
      ],
      order: { amount: sort === 'asc' ? 'ASC' : 'DESC' },
      relations: ['payments', 'cancellations'], // Include related entities
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data: result, total };
  }

  // Fetch a single ticket by ID, including related payments and cancellations
  async findOne(id: number): Promise<Ticket> {
    return this.ticketRepository.findOne({
      where: { ticketId: id },
      relations: ['payments', 'cancellations'], // Include related entities
    });
  }

  // Fetch ticket by payment ID
  async findByPaymentId(paymentId: number): Promise<Ticket> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentId },
      relations: ['ticket'], // Include the ticket in the relation
    });
    return payment?.ticket;
  }

  // Fetch ticket by cancellation ID
  async findByCancellationId(cancellationId: number): Promise<Ticket> {
    const cancellation = await this.cancellationRepository.findOne({
      where: { cancellationId },
      relations: ['ticket'], // Include the ticket in the relation
    });
    return cancellation?.ticket;
  }

  // Update a ticket and handle transactional updates for related entities
  async update(id: number, dto: UpdateTicketDto): Promise<Ticket> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Ticket, id, dto);
      const updatedTicket = await queryRunner.manager.findOne(Ticket, {
        where: { ticketId: id },
        relations: ['payments', 'cancellations'], // Include related entities
      });
      await queryRunner.commitTransaction();
      return updatedTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Remove a ticket and handle deletions in a transaction
  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Ticket, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
