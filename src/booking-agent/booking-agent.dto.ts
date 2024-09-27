import { IsNotEmpty, IsOptional, IsEmail, IsString } from 'class-validator';

export class CreateBookingAgentDto {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    contactNumber?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    agencyName?: string;

    @IsNotEmpty()
    createdBy: number;

    @IsNotEmpty()
    updatedBy: number;
}

export class UpdateBookingAgentDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsString()
    contactNumber?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    agencyName?: string;

    @IsOptional()
    deletedAt?: Date;

    @IsOptional()
    updatedBy?: number;
}
