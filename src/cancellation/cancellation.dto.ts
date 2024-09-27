import { IsDate, IsInt, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateCancellationDto {
    @IsDate()
    cancellationDate: Date;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsNotEmpty()
    @IsInt()
    ticketId: number;

    @IsInt()
    createdBy: number;

    @IsInt()
    updatedBy: number;
}

// src/cancellation/dto/update-cancellation.dto.ts

export class UpdateCancellationDto {
    @IsOptional()
    @IsDate()
    cancellationDate?: Date;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsOptional()
    @IsInt()
    createdBy?: number;

    @IsOptional()
    @IsInt()
    updatedBy?: number;
}
