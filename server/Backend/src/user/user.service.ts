import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { SelectUser } from './entities/user-allowed-fields.entity';
import { FormatedQueryType, PaginationQueryType, PrismaSearchQueryType } from './dto/query-validation.dto';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Injectable()

export class UserService {

  private selectUser: SelectUser = new SelectUser

  constructor(
    private prisma: PrismaService,
    private logger: Logger,
    private readonly notification: NotificationGateway
  ) { }

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create(
      {
        data,
      }
    )
    return user;
  }

  async createMany(data: CreateUserDto[]): Promise<any> { // debug
    const users = await this.prisma.user.createMany(
      { data }
    )
    return users;
  }

  async findAll(
    paginationQueries?: PaginationQueryType,
    searchQueries?: PrismaSearchQueryType
  ): Promise<User[]> {
    const user: User[] = await this.prisma.user.findMany({
      select: { ...this.selectUser },
      ...paginationQueries,
    })
    return user.map(user => {
      this.notification.isOnline(user.id) ? user.status = 'online' : user.status = 'offline';
      return user;
    });
  }

  async findOne(id: string, selectedFields?: Partial<SelectUser>): Promise<User> {

    if (!id) 
      return {};

    const user: User = await this.prisma.user.findUnique(
      {
        where: {
          id: id,
        },
        select: {
          ...this.selectUser,
          ...selectedFields,
        },
      },
    )
    if (user)
      this.notification.isOnline(user.id) ? user.status = 'online' : user.status = 'offline';

    return user;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user: User = await this.prisma.user.update(
      {
        where: {
          id,
        },
        data,
        select: { ...this.selectUser }
      }
    )
    if (user)
      this.notification.isOnline(user.id) ? user.status = 'online' : user.status = 'offline';
    return user;
  }

  async findOrCreateUser (
    data: { username: string, avatar: string, email: string, name: string; }
  ): Promise<User> {
    const user: User = await this.prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {
        // ...data
      },
      create: {
        ...data
      },
    })
    if (user)
      this.notification.isOnline(user.id) ? user.status = 'online' : user.status = 'offline';
    console.log("find or create = ", user);
    return user;
  }

  async findUserByUsername(
    username: string,
    selectedFields?: Partial<SelectUser>
  ): Promise<User> {
     const user : User = await this.prisma.user.findUnique({
      where: {
        username
      },
      select: {
        ...this.selectUser,
        ...selectedFields
      }
    })
    if (user)
      this.notification.isOnline(user.id) ? user.status = 'online' : user.status = 'offline';
    return user;
  }

  async searchForUsers(paginationQueries: PaginationQueryType, username: string): Promise<User[]> {
    if (!username)
      return [];
    const user: User[] = await this.prisma.user.findMany({
      where: {
        username: {
          // search: username,
          contains: username,
          mode: 'insensitive'
        }
      },
      select: { ...this.selectUser },
      ...paginationQueries,
      take: 20,
    })
    return user.map(user => {
      this.notification.isOnline(user.id) ? user.status = 'online' : user.status = 'offline';
      return user;
    });
  }

  async remove(id: string): Promise<User> {
    const user: User = await this.prisma.user.delete({
      where: {
        id,
      },
    })
    if (user)
      this.notification.isOnline(user.id) ? user.status = 'online' : user.status = 'offline';

    return user;
  }

  async truncate(): Promise<any> { // debug
    return this.prisma.user.deleteMany(); // debug only
  }
}
