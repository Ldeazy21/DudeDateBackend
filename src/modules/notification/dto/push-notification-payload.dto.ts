export class NotificationPayloadDto {
  user_ids?: string[];
  title?: string;
  subtitle?: string;
  content?: string;
  type?: NotificationType;
  team_id?: string;
  data?: any;
}

export enum NotificationType {
  GENERAL = 'GENERAL',
  FRIENDSHIP = 'FRIENDSHIP',
  CHAT = 'CHAT',
  MESSAGE = 'MESSAGE',
  MOMENT = 'MOMENT',
  CALL = 'CALL',
  HELP = 'HELP',
  INVITATION = 'INVITATION',
  MATCH_SCHEDULE = 'MATCH_SCHEDULE',
}
