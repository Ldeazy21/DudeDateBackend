import { SetMetadata } from '@nestjs/common';

import { Role } from '@prisma/client';

export const Roles = (...args: Role[]) => SetMetadata('roles', args);
export const TeamOwnerRoleOnly = Roles(Role.TEAM_OWNER);
export const UserRoleOnly = Roles(Role.USER);
