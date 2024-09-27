import { IsNotEmpty, IsString, IsDecimal, IsOptional, IsInt } from 'class-validator';

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsString()
    paymentMethod: string;

    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '0,2' })
    amount: number;

    @IsNotEmpty()
    @IsInt()
    createdBy: number;

    @IsNotEmpty()
    @IsInt()
    updatedBy: number;

    @IsNotEmpty()
    @IsInt()
    ticketId: number;
}

export class UpdatePaymentDto {
    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,2' })
    amount?: number;

    @IsOptional()
    @IsInt()
    createdBy?: number;

    @IsOptional()
    @IsInt()
    updatedBy?: number;

    @IsOptional()
    @IsInt()
    ticketId?: number; 
}
