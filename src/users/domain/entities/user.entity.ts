import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CreateUserModel } from '../dto/create-user-model.dto';
import { UpdateUserModel } from '../dto/update-user-model.dto';

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

  @ApiPropertyOptional()
  phone: string;

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
    photo?: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.photo = photo || '';
  }

  static toHttpResponse(user: any): UserEntity {
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.photo || '',
      user.password,
      user.createdAt,
      user.updatedAt,
    );
  }

  static parseUserToCreateDto(user: CreateUserModel) {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      birth_date: user.birth_date,
    };
  }

  static parseUserToUpdateDto(user: UpdateUserModel) {
    return {
      name: user.name,
      role: user.role,
      birth_date: user.birth_date,
      active: user.active,
    };
  }
}
