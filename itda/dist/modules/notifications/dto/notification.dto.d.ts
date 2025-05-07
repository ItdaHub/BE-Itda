export declare class SendNotificationDto {
    user: any;
    content: string;
    novel?: any | null;
    report?: any | null;
    type?: "REPORT" | "NOVEL_SUBMIT";
}
