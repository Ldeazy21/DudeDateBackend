import { NotificationType } from '@prisma/client';

export interface NotificationInterface {
  type: NotificationType;
  title?: string;
  message?: string;
  sender_id?: string;
  user_id: string;
  event_id?: string;
  team_id?: string;
  match_schedule_id?: string;
  team_invitation_id?: string;
  annoucement_id?: string;
}
