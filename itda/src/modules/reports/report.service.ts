import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>
  ) {}

  async findAll(): Promise<Report[]> {
    return this.reportRepository.find({ relations: ["reporter"] });
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ["reporter"],
    });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async create(report: Report): Promise<Report> {
    return this.reportRepository.save(report);
  }

  async remove(id: number): Promise<void> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    await this.reportRepository.remove(report);
  }
}
