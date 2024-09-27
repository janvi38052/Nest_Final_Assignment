import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './booking.dto';
import { Train } from '../train/train.entity'; // Import Train entity

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Train) // Inject the Train repository
    private readonly trainRepository: Repository<Train>,

    private readonly dataSource: DataSource, // manage the transactions
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking | null> {
    const { bookingDate, trainId } = createBookingDto; // Now we have trainId
    const date = new Date(bookingDate);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid booking date');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Check if train exists
      const train = await this.trainRepository.findOneBy({ trainId });
      if (!train) {
        throw new Error(`Train with ID ${trainId} not found`);
      }

      const newBooking = this.bookingRepository.create({
        bookingDate: date,
        train: train, // Associate train with booking
      });

      const booking = await queryRunner.manager.save(Booking, newBooking);
      await queryRunner.commitTransaction();
      return booking;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['train'] }); // Fetch with train relation
  }

  async findOne(bookingId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { bookingId },
      relations: ['train'], // Fetch with train relation
    });

    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }

    return booking;
  }

  async update(bookingId: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const booking = await this.findOne(bookingId);
      Object.assign(booking, updateBookingDto);

      // Check if trainId exists in update
      if (updateBookingDto.trainId) {
        const train = await this.trainRepository.findOneBy({ trainId: updateBookingDto.trainId });
        if (!train) {
          throw new Error(`Train with ID ${updateBookingDto.trainId} not found`);
        }
        booking.train = train; // Associate train if updated
      }

      const updatedBooking = await queryRunner.manager.save(Booking, booking);
      await queryRunner.commitTransaction();
      return updatedBooking;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(bookingId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.delete(Booking, bookingId);

      if (result.affected === 0) {
        throw new Error(`Booking with ID ${bookingId} not found`);
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
