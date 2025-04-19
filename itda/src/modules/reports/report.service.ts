import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Report, TargetType } from "./report.entity";
import { Comment } from "../comments/comment.entity";
import { Chapter } from "../chapter/chapter.entity";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>
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
    console.log("🎯 Reporting:", report); // 여기서 report 객체 전체를 출력하여 reported_content를 확인

    if (report.target_type === TargetType.COMMENT) {
      const comment = await this.commentRepository.findOneBy({
        id: report.target_id,
      });
      if (!comment) throw new NotFoundException("댓글을 찾을 수 없습니다.");
      report.reported_content = comment.content;
      console.log("📝 Reported Content (Comment):", report.reported_content); // 댓글 내용 출력
    } else if (report.target_type === TargetType.CHAPTER) {
      const chapter = await this.chapterRepository.findOne({
        where: { id: report.target_id },
        relations: ["novel"], // ✅ novel 관계 포함
      });
      if (!chapter) throw new NotFoundException("챕터를 찾을 수 없습니다.");
      report.reported_content = `[${chapter.novel.title} - ${chapter.chapter_number}화]\n${chapter.content}`;
      console.log("📝 Reported Content (Chapter):", report.reported_content); // 챕터 내용 출력
    }

    // 저장 전에 로그로 확인
    console.log("✅ Saving Report:", report);
    return this.reportRepository.save(report);
  }

  async delete(id: number): Promise<boolean> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) return false;

    await this.reportRepository.remove(report);
    return true;
  }
}
