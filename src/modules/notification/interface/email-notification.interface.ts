export interface EmailNotificationInterface {
  email: string;
  otp?: string;
  message?: string;
  template: string;
  subject?: string;
  team_name?: string;
  invitor_name?: string;
}
