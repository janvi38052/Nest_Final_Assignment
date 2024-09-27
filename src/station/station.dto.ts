import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateStationDto {
    @IsString()
    stationName: string;

    @IsOptional()
    @IsArray()
    trainIds?: number[];

    @IsNumber()
    createdBy: number;

    @IsNumber()
    updatedBy: number;
}

export class UpdateStationDto {
    @IsOptional()
    @IsString()
    stationName?: string;

    @IsOptional()
    @IsArray()
    trainIds?: number[];

    @IsOptional()
    @IsNumber()
    createdBy?: number;

    @IsOptional()
    @IsNumber()
    updatedBy?: number;
}
