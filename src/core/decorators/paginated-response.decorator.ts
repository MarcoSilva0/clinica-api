import {
  applyDecorators,
  Type,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationResponse } from '../utils/paginationResponse';

export const ApiPaginatedResponse = <TModel extends Type<unknown>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginationResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(PaginationResponse),
          },
        ],
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          totalItems: { type: 'number' },
          totalPages: { type: 'number' },
          currentPage: { type: 'number' },
        },
      },
    }),
  );
};
