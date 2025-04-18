import { Report } from "./report.entity";
import { Repository } from "typeorm";
export declare class ReportService {
    private readonly reportRepository;
    constructor(reportRepository: Repository<Report>);
    findAll(): Promise<Report[]>;
    findOne(id: number): Promise<Report>;
    create(report: Report): Promise<Report>;
    remove(id: number): Promise<void>;
}
