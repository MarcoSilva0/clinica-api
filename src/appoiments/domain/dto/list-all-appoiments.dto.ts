import { ApiProperty } from '@nestjs/swagger';

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
}
