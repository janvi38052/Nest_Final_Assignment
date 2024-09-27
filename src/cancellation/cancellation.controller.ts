import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { CancellationService } from './cancellation.service';
import { CreateCancellationDto, UpdateCancellationDto } from './cancellation.dto';
import { Cancellation } from './cancellation.entity';

@Controller('cancellations')
export class CancellationController {
  constructor(private readonly cancellationService: CancellationService) {}

  @Post()
  create(@Body() dto: CreateCancellationDto): Promise<Cancellation> {
    return this.cancellationService.create(dto);
  }
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('sortBy') sortBy = 'reason',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Cancellation[]; totalRecords: number; totalPages: number; currentPage: number }> {
    return this.cancellationService.findAll(+page, +limit, search, sortBy, sortOrder);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Cancellation> {
    return this.cancellationService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateCancellationDto,
  ): Promise<Cancellation> {
    return this.cancellationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.cancellationService.remove(id);
  }
}
