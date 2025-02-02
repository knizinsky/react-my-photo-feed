import { Comment } from "./Comment";
import { User } from "./User";

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  comments: Comment[];
  user: User;
}
