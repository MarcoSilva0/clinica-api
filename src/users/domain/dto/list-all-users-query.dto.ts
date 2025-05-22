import { ApiProperty } from "@nestjs/swagger";

export class ListAllUsersQueryDto {
  @ApiProperty({ type: String, required: false })
  name?: string;

  @ApiProperty({ type: String, required: false })
  email?: string;

  @ApiProperty({ type: Boolean, required: false })
  active?: boolean;

  @ApiProperty({ type: Number, required: false })
  page?: number;

  @ApiProperty({ type: Number, required: false })
  pageSize?: number;
}