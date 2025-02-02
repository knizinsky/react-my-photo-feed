import { User } from "./User";

export interface Photo {
    id: string;
    album_id: string;
    url: string;
    description: string;
    created_at: string;
    user_id: string;
    albums: Album;
    users: User;
}

interface Album {
    name: string;
}

