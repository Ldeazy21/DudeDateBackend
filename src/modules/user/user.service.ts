import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { getTakeAndSkip, PaginationRequest } from 'src/common/dtos';
import { Role } from '@prisma/client';
import { UserUtils } from 'src/common/utils/user.utils';
import { StripeService } from 'src/modules/payments/stripe.service';
import Stripe from 'stripe';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async create(body: CreateUserDto) {
    try {
      const { is_owner, ...rest } = body;
      const create_customer: Stripe.CustomerCreateParams = {
        email: rest.email,
      };

      const { stripe_customer_id } =
        await this.stripeService.createCustomer(create_customer);

      return await this.prisma.user.create({
        data: { ...rest, stripe_customer_id },
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        team_members: {
          where: {
            is_removed: true,
          },
        },
      },
    });
  }
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async verifyUser(email: string) {
    return await this.prisma.user.update({
      where: { email },
      data: { is_verified: true },
    });
  }

  async update(user_id: string, body: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          ...body,
        },
      });

      const { password, ...userWithoutPassword } = updatedUser;
      return { data: userWithoutPassword };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(email: string, password: string) {
    return await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: password,
      },
    });
  }

  async getAllUser(user_id: string, team_id: string, query: PaginationRequest) {
    try {
      const { take, skip } = getTakeAndSkip(query.page, query.size);
      const [users, total_records] = await Promise.all([
        this.prisma.user.findMany({
          where: {
            NOT: {
              id: user_id,
            },
            role: Role.USER,
            team_members: {
              every: {
                OR: [
                  {
                    is_removed: true,
                    NOT: {
                      team_id: team_id,
                    },
                  },
                  {
                    is_removed: true,
                    team_id,
                  },
                ],
              },
            },
          },

          take,
          skip,
          orderBy: {
            created_at: 'desc',
          },
        }),

        this.prisma.user.count({
          where: {
            NOT: {
              id: user_id,
            },
            role: Role.USER,
            team_members: {
              every: {
                OR: [
                  {
                    is_removed: true,
                    NOT: {
                      team_id: team_id,
                    },
                  },
                  {
                    is_removed: true,
                    team_id,
                  },
                ],
              },
            },
          },
        }),
      ]);
      const total_pages = Math.ceil(total_records / take);
      return {
        data: users,
        pagination: {
          current_page: +query.page,
          page_size: take,
          total_pages,
          total_records,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
