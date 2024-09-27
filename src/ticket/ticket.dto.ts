import { IsNotEmpty, IsNumber, IsString, IsDate, IsDecimal, IsInt, IsOptional, IsArray } from 'class-validator';

export class CreateTicketDto {
  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsInt()
  @IsNotEmpty()
  noOfSeats: number;

  @IsDate()
  @IsNotEmpty()
  dateTime: Date;

  @IsNumber()
  @IsNotEmpty()
  createdBy: number;

  @IsNumber()
  @IsNotEmpty()
  updatedBy: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true }) 
  paymentIds?: number[];  

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true }) 
  cancellationIds?: number[];  
}

export class UpdateTicketDto {
  @IsOptional()
  @IsDate()
  startTime?: Date;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsDecimal()
  amount?: number;

  @IsOptional()
  @IsInt()
  noOfSeats?: number;

  @IsOptional()
  @IsDate()
  dateTime?: Date;

  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @IsOptional()
  @IsNumber()
  updatedBy?: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true }) 
  paymentIds?: number[]; 

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true }) 
  cancellationIds?: number[];  
}
