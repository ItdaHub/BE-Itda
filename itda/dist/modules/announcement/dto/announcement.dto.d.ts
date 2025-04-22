export declare class AnnouncementWithAdminDto {
    id: number;
    title: string;
    content: string;
    priority: "urgent" | "normal";
    start_date: Date;
    created_at: Date;
    updated_at: Date;
    admin: {
        id: number;
        email: string;
        nickname: string;
    };
    isRead: boolean;
}
