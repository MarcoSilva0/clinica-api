import { ApiProperty } from '@nestjs/swagger';
import { AppoimentsStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested, IsArray } from 'class-validator';

export class OrderByDto {
  @ApiProperty({
    required: true,
    description: 'Field to order by',
    enum: ['createdAt', 'status', 'confirmationDate', 'date_start'],
    example: 'createdAt',
  })
  field: 'createdAt' | 'status' | 'confirmationDate' | 'date_start';

  @ApiProperty({
    required: true,
    description: 'Order direction',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  direction: 'asc' | 'desc';
}

export class ListAllAppoimentsQueryDto {
  @ApiProperty({
    required: true,
    description: 'Page number',
    default: 1,
  })
  page?: number;

  @ApiProperty({
    required: true,
    description: 'Number of items per page',
    default: 10,
  })
  pageSize?: number;

  @ApiProperty({
    required: false,
    description: 'Search by name, email cpf or phone',
    default: '',
  })
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by exam type ID',
    default: '',
  })
  examsTypeId?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by appoiment status',
    default: '',
  })
  status?: AppoimentsStatus;

  @ApiProperty({
    required: false,
    description: 'Search by appoiment start date',
    default: '',
  })
  startDate?: string;

  @ApiProperty({
    required: false,
    description: 'Search by appoiment end date',
    default: '',
  })
  endDate?: string;

  @ApiProperty({
    required: false,
    description: 'Multiple order criteria',
    type: [OrderByDto],
    example: [
      { field: 'status', direction: 'asc' },
      { field: 'date_start', direction: 'desc' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderByDto)
  orderBy?: OrderByDto[];

  @ApiProperty({
    required: false,
    description:
      'Single field to order by (deprecated, use orderBy array instead)',
    enum: ['createdAt', 'status', 'confirmationDate', 'date_start'],
    default: 'createdAt',
  })
  @IsOptional()
  singleOrderBy?: 'createdAt' | 'status' | 'confirmationDate' | 'date_start';

  @ApiProperty({
    required: false,
    description:
      'Order direction for single field (deprecated, use orderBy array instead)',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  orderDirection?: 'asc' | 'desc';
}
