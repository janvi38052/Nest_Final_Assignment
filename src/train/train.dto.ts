export class CreateTrainDto {
  trainName: string;
  trainNumber: string;
  stationIds?: number[]; 
  createdBy?: number; 
  updatedBy?:number;
}

export class UpdateTrainDto {
  trainName?: string; 
  trainNumber?: string; 
  stationIds?: number[]; 
  createdBy?: number; 
  updatedBy?:number; 
}
