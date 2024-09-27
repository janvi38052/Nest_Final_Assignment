import { IsDate, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookingDto {
    @IsDate()
    @IsNotEmpty()
    bookingDate: Date;

    @IsInt()
    @IsNotEmpty()
    trainId: number; 

    @IsInt()
    @IsNotEmpty()
    createdBy: number; 

    @IsInt()
    @IsNotEmpty()
    updatedBy: number; 
}

export class UpdateBookingDto {
    @IsOptional()
    @IsDate()
    bookingDate?: Date;

    @IsOptional()
    @IsInt()
    trainId?: number; 

    @IsOptional()
    deletedAt?: Date; 

    @IsOptional()
    updatedBy?: number; 
}
