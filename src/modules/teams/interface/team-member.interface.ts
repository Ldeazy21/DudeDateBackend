import { TeamMemberRole } from '@prisma/client';

export interface TeamMemberInterface {
  id: string;
  team_id: string;
  user_id: string;
  team_member_role: TeamMemberRole;
  is_removed: boolean;
  created_at: string;
  updated_at: string;
}
