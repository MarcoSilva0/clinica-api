import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  mountPagination,
  PaginationResponse,
} from 'src/core/utils/paginationResponse';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListAllUsersQueryDto } from '../domain/dto/list-all-users-query.dto';
import { Users } from '@prisma/client';
import { UpdateUserStatusDto } from '../domain/dto/update-user-status.dto';
import { CreateUserModel } from '../domain/dto/create-user-model.dto';
import { UpdateUserModel } from '../domain/dto/update-user-model.dto';

@Injectable()
export default class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(user: CreateUserModel): Promise<Users> {
    if (!user.password) {
      throw new InternalServerErrorException('Password is required');
    }
    return this.prisma.users.create({
      data: {
        ...user,
        password: user.password,
      },
    });
  }

  async findAll(
    filters: ListAllUsersQueryDto,
  ): Promise<PaginationResponse<Users>> {
    const { page, pageSize, skip, take } = mountPagination({
      page: filters.page,
      pageSize: filters.pageSize,
    });

    const totalUsers = await this.prisma.users.count();

    const whereInput = {};

    if (filters.name || filters.email) {
      whereInput['OR'] = [
        [
          {
            name: {
              contains: filters.name,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: filters.email,
              mode: 'insensitive',
            },
          },
        ],
      ];
    }

    if (filters.active !== undefined && filters.active !== null) {
      whereInput['AND'] = [
        {
          active: {
            equals:
              typeof filters.active === 'boolean'
                ? filters.active
                : filters.active === 'true',
          },
        },
      ];
    }

    const users = await this.prisma.users.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      where: whereInput,
    });

    return {
      data: users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / pageSize) ?? 1,
      totalItems: totalUsers ?? 0,
    };
  }

  async findOne(id: string): Promise<Users | null> {
    return this.prisma.users.findFirst({
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }

  async update(id: string, user: UpdateUserModel) {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        ...user,
      },
    });
  }

  async updateUserPhoto(id: string, photo: string) {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        photo,
      },
    });
  }

  async updateUserPassword(id: string, password: string) {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        password,
        tempPassword: false,
      },
    });
  }

  async updateUserEmail(id: string, email: string) {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        email,
      },
    });
  }

  async changeActiveStatus(id: string, data: UpdateUserStatusDto) {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        active: data.status,
      },
    });
  }

  async findFirstAdmin(): Promise<Users | null> {
    return this.prisma.users.findFirst({
      where: {
        role: 'ADMIN',
      },
    });
  }

  async updateLastLogin(id: string): Promise<Users | null> {
    try {
      return this.prisma.users.update({
        where: {
          id,
        },
        data: {
          lastLogin: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating last login');
    }
  }
}
