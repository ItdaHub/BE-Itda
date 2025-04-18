import { User } from "../modules/users/user.entity";
export declare class Announcement {
    id: number;
    title: string;
    content: string;
    admin: User;
    start_date: Date;
    created_at: Date;
    updated_at: Date;
}
