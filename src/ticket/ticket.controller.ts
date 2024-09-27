import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto, UpdateTicketDto } from './ticket.dto';
import { Ticket } from './ticket.entity';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async create(@Body() dto: CreateTicketDto): Promise<Ticket> {
    return this.ticketService.create(dto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
  ): Promise<{ data: Ticket[]; total: number }> {
    return this.ticketService.findAll(page, limit, search, sort);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Ticket> {
    return this.ticketService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateTicketDto): Promise<Ticket> {
    return this.ticketService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.ticketService.remove(id);
  }
}
