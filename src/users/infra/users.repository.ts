import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  mountPagination,
  PaginationResponse,
} from 'src/core/utils/paginationResponse';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListAllUsersQueryDto } from '../domain/dto/list-all-users-query.dto';
import { User } from '@prisma/client';
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
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(user: any) {
    return this.prisma.user.create({
      data: {
        ...user,
      },
    });
  }

  async findAll(
    filters: ListAllUsersQueryDto,
  ): Promise<PaginationResponse<User>> {
    const { page, pageSize, skip, take } = mountPagination({
      page: filters.page,
      pageSize: filters.pageSize,
    });

    const totalUsers = await this.prisma.user.count();

    const users = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      where: {
        name: {
          contains: filters.name,
          mode: 'insensitive',
        },
        email: {
          contains: filters.email,
          mode: 'insensitive',
        },
        AND: [
          {
            active: {
              equals: filters.active,
            },
          },
        ],
      },
    });

    return {
      data: users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / pageSize) ?? 1,
      totalItems: totalUsers ?? 0,
    };
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async update(id: string, user: UserEntity) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...user,
      },
    });
  }

  async changeActiveStatus(id: string, data: UpdateUserStatusDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        active: data.status,
      },
    });
  }
}
