import { User } from "./User";

export interface Comment {
  id: string;
  user: User;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
}
