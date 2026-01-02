import { Role } from '@prisma/client';
import {
  TeamInterface,
  TeamMemberInterface,
} from 'src/modules/teams/interface';

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  password: string;
  profile_picture_url: string;
  role: Role;
  stripe_customer_id: string | null;
  account_number: string | null;
  is_deleted: boolean;
  is_blocked: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  team?: TeamInterface[] | [];
  team_members?: TeamMemberInterface[] | [];
}
