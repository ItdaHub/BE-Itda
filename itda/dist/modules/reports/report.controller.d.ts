import { ReportService } from "./report.service";
import { Report } from "./report.entity";
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    findAll(): Promise<Report[]>;
    findOne(id: number): Promise<Report>;
    create(report: Report): Promise<Report>;
    remove(id: number): Promise<void>;
}
