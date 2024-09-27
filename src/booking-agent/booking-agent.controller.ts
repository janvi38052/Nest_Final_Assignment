import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { BookingAgentService } from './booking-agent.service';
import { CreateBookingAgentDto, UpdateBookingAgentDto } from './booking-agent.dto';
import { BookingAgent } from './booking-agent.entity';

@Controller('bookingAgents')
export class BookingAgentController {
  constructor(private readonly bookingAgentService: BookingAgentService) {}

  @Post()
  async create(@Body() createBookingAgentDto: CreateBookingAgentDto): Promise<BookingAgent> {
    return this.bookingAgentService.create(createBookingAgentDto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('sortBy') sortBy = 'name',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: BookingAgent[]; totalRecords: number; totalPages: number; currentPage: number }> {
    return this.bookingAgentService.findAll(+page, +limit, search, sortBy, sortOrder);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BookingAgent> {
    return this.bookingAgentService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBookingAgentDto: UpdateBookingAgentDto,
  ): Promise<BookingAgent> {
    return this.bookingAgentService.update(id, updateBookingAgentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.bookingAgentService.remove(id);
  }
}
