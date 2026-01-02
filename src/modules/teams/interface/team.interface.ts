export interface TeamInterface {
  id: string;
  name: string;
  type: string;
  description: string;
  logo_url: string;
  owner_id: string;

  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
