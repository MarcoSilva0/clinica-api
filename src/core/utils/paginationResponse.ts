import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  pageSize: number;
}

export function mountPagination({
  page,
  pageSize,
}: PaginationParams): PaginationResult {
  const safePage = page && page > 0 ? page : 1;
  const safePageSize = pageSize && pageSize > 0 ? pageSize : 10;

  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  return {
    skip: Number(skip),
    take: Number(take),
    page: safePage,
    pageSize: safePageSize,
  };
}

export class PaginationDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;
}
