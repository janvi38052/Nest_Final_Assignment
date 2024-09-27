import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() paymentData: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(paymentData);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10, 
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'amount',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC', 
  ): Promise<{ data: Payment[]; totalRecords: number; totalPages: number; currentPage: number }> {
    return this.paymentService.findAll(page, limit, search, sortBy, sortOrder);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateData: UpdatePaymentDto): Promise<Payment> {
    return this.paymentService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.paymentService.remove(id);
  }
}
