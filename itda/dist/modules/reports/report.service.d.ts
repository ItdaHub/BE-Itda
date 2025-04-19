import { Repository } from "typeorm";
import { Report } from "./report.entity";
import { Comment } from "../comments/comment.entity";
import { Chapter } from "../chapter/chapter.entity";
export declare class ReportService {
    private readonly reportRepository;
    private readonly commentRepository;
    private readonly chapterRepository;
    constructor(reportRepository: Repository<Report>, commentRepository: Repository<Comment>, chapterRepository: Repository<Chapter>);
    findAll(): Promise<Report[]>;
    findOne(id: number): Promise<Report>;
    create(report: Report): Promise<Report>;
    delete(id: number): Promise<boolean>;
}
