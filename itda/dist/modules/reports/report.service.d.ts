import { Repository } from "typeorm";
import { Report } from "./report.entity";
export declare class ReportService {
    private reportRepository;
    constructor(reportRepository: Repository<Report>);
    findAll(): Promise<Report[]>;
    findOne(id: number): Promise<Report>;
    create(report: Report): Promise<Report>;
    remove(id: number): Promise<void>;
}
