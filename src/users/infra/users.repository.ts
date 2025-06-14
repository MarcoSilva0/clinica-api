import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  mountPagination,
  PaginationResponse,
} from 'src/core/utils/paginationResponse';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListAllUsersQueryDto } from '../domain/dto/list-all-users-query.dto';
import { Users } from '@prisma/client';
import { UpdateUserStatusDto } from '../domain/dto/update-user-status.dto';
import { UserEntity } from '../domain/entities/user.entity';
import { UploadService } from 'src/upload/service/upload.service';

@Injectable()
export default class UsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findUserByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(user: any) {
    return this.prisma.users.create({
      data: {
        ...user,
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
    console.log('filters', filters);

    if (filters.active !== undefined && filters.active !== null) {
      whereInput['AND'] = [
        {
          active: {
            equals: typeof filters.active === 'boolean' ? filters.active : filters.active === 'true',
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

  async update(id: string, user: UserEntity) {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        ...user,
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
}
