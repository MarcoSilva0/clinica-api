import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  photo: string;

  @ApiProperty({ enumName: 'Role', enum: Role })
  role: Role;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  birth_date: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static toHttpResponse(user: any): UserEntity {
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt,
    );
  }
}
