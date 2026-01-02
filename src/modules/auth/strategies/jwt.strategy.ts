import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpire: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }
  async validate(payload: any) {
    if (!this.validate) {
      throw new UnauthorizedException();
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.id,
        is_deleted: false,
        is_blocked: false,
      },
      include: {
        team: {
          where: {
            is_deleted: false,
          },
        },
        team_members: {
          where: {
            is_removed: false,
          },
        },
      },
    });
    return user;
  }
}
