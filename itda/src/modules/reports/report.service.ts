import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Report } from "./report.entity";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>
  ) {}

  // 모든 신고 목록 조회
  async findAll(): Promise<Report[]> {
    return this.reportRepository.find();
  }

  // 특정 신고 조회
  async findOne(id: number): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return report;
  }

  // 신고 생성
  async create(report: Report): Promise<Report> {
    return this.reportRepository.save(report);
  }

  // 신고 삭제
  async remove(id: number): Promise<void> {
    const result = await this.reportRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
  }
}
