import { IsOptional, IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DashboardFiltersDto {
  @IsOptional()
  examTypeIds?: string;
}
