import { ReportService } from "./report.service";
import { Report } from "./entities/report.entity";
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    reportComment(commentId: number, reportData: {
        reason: string;
    }, req: any): Promise<Report>;
    reportChapter(chapterId: number, reportData: {
        reason: string;
    }, req: any): Promise<Report>;
    getAllReports(): Promise<Report[]>;
    getReportById(id: number): Promise<Report>;
    deleteReport(id: number): Promise<{
        message: string;
    }>;
    handleReport(id: number): Promise<{
        message: string;
    }>;
}
