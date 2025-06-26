import { IsOptional, IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DashboardFiltersDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(id => id.trim()).filter(id => id.length > 0);
    }
    return value;
  })
  examTypeIds?: string[];
}
