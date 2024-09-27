import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } }); 
  }

  async findOne(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { userId } }); 
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepository.create(createUserDto);

      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(createUserDto.password, salt);

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return user;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { userId } });

      if (!user) {
        throw new Error('User not found');
      }

      queryRunner.manager.merge(User, user, updateUserDto);

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return user;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }

  async remove(userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(User, userId);
      await queryRunner.commitTransaction();

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }
}
