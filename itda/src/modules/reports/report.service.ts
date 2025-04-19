import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Report, TargetType } from "./report.entity";
import { Comment } from "../comments/comment.entity";
import { Chapter } from "../chapter/chapter.entity";
import { User, UserStatus } from "../users/user.entity";
import { UserService } from "../users/user.service";
import { NotificationService } from "../notifications/notification.service";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
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
    if (report.target_type === TargetType.COMMENT) {
      const comment = await this.commentRepository.findOne({
        where: { id: report.target_id },
        relations: ["user"],
      });
      if (!comment) throw new NotFoundException("댓글을 찾을 수 없습니다.");

      report.reported_content = comment.content;
      report.reported_user_id = comment.user?.id;
    } else if (report.target_type === TargetType.CHAPTER) {
      const chapter = await this.chapterRepository.findOne({
        where: { id: report.target_id },
        relations: ["author", "novel"],
      });
      if (!chapter) throw new NotFoundException("챕터를 찾을 수 없습니다.");

      report.reported_content = `[${chapter.novel.title} - ${chapter.chapter_number}화]\n${chapter.content}`;
      report.reported_user_id = chapter.author?.id;

      report.chapter = chapter;
    }

    return this.reportRepository.save(report);
  }

  async delete(id: number): Promise<boolean> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) return false;

    await this.reportRepository.remove(report);
    return true;
  }

  async findReportedUser(report: Report): Promise<User | null> {
    if (report.target_type === TargetType.COMMENT) {
      const comment = await this.commentRepository.findOne({
        where: { id: report.target_id },
        relations: ["user"],
      });
      return comment?.user ?? null;
    }

    if (report.target_type === TargetType.CHAPTER) {
      const chapter = await this.chapterRepository.findOne({
        where: { id: report.target_id },
        relations: ["writer"],
      });
      return chapter?.author ?? null;
    }

    return null;
  }

  async handleReport(reportId: number): Promise<string> {
    const report = await this.findOne(reportId);
    if (!report) throw new NotFoundException("해당 신고가 존재하지 않습니다.");

    const reportedUser = await this.findReportedUser(report);
    if (!reportedUser)
      throw new NotFoundException("신고 대상 유저를 찾을 수 없습니다.");

    // 신고 횟수 +1
    reportedUser.report_count += 1;

    // 신고 횟수가 2회 이상이면 정지 처리
    let message = "⚠️ 신고가 접수되었습니다. 주의해 주세요!";
    if (reportedUser.report_count >= 2) {
      reportedUser.status = UserStatus.BANNED;
      message = "🚨 신고가 누적되어 계정이 정지되었습니다!";
    }

    await this.userService.save(reportedUser);

    // 알림 전송
    await this.notificationService.sendNotification({
      user: reportedUser,
      content: message,
    });

    return "신고 처리 완료";
  }
}
