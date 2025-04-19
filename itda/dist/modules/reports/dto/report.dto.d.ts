import { TargetType } from "../report.entity";
export declare class ReportDto {
    id: number;
    reason: string;
    reported_content: string | null;
    target_type: TargetType;
    target_id: number;
    created_at: Date;
    reporter: {
        id: number;
        name: string;
        nickname: string;
    };
}
