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
    return this.reportRepository.find({
      where: { handled: false }, // ✅ 처리되지 않은 신고만
      relations: ["reporter"],
      order: { created_at: "DESC" },
    });
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ["reporter"],
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // 신고된 대상의 존재 여부를 target_type에 따라 확인
    if (report.target_type === TargetType.CHAPTER) {
      const chapter = await this.chapterRepository.findOne({
        where: { id: report.target_id },
      });
      if (!chapter) {
        throw new NotFoundException(
          `Chapter not found for ID ${report.target_id}`
        );
      }
    }

    if (report.target_type === TargetType.COMMENT) {
      const comment = await this.commentRepository.findOne({
        where: { id: report.target_id },
      });
      if (!comment) {
        throw new NotFoundException(
          `Comment not found for ID ${report.target_id}`
        );
      }
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

      report.chapter = chapter;
      report.reported_content = `[${chapter.novel.title} - ${chapter.chapter_number}화]\n${chapter.content}`;
      report.reported_user_id = chapter.author?.id;
    }

    return this.reportRepository.save(report);
  }

  async delete(id: number): Promise<boolean> {
    const report = await this.reportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // 삭제하려는 신고가 존재하면 삭제
    await this.reportRepository.remove(report);
    return true;
  }

  // 신고 대상 유저 찾기
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
        relations: ["author"],
      });
      return chapter?.author ?? null;
    }

    return null;
  }

  // 신고 처리
  async handleReport(reportId: number): Promise<boolean> {
    console.log(`🛠️ 신고 ID: ${reportId} 처리 시작`);

    const report = await this.findOne(reportId);
    if (!report) {
      console.log(`❌ 신고 ID ${reportId}를 찾을 수 없습니다`);
      return false;
    }

    console.log(`📄 신고 데이터:`, report);

    // 신고 대상 유저 찾기
    const reportedUser = await this.findReportedUser(report);
    if (!reportedUser) {
      console.log(`❌ 신고 대상 유저를 찾을 수 없습니다`);
      return false;
    }

    console.log(
      `👤 신고 대상 유저: ${reportedUser.nickname} (ID: ${reportedUser.id})`
    );

    // 👉 신고된 콘텐츠 삭제
    if (report.target_type === TargetType.COMMENT) {
      await this.commentRepository.delete(report.target_id);
      console.log(`🗑️ 댓글(ID: ${report.target_id}) 삭제됨`);
    } else if (report.target_type === TargetType.CHAPTER) {
      await this.chapterRepository.delete(report.target_id);
      console.log(`🗑️ 챕터(ID: ${report.target_id}) 삭제됨`);
    }

    // 신고 횟수 증가
    reportedUser.report_count = (reportedUser.report_count || 0) + 1;
    console.log(`⚠️ 신고 횟수: ${reportedUser.report_count}`);

    // 신고 누적 처리 (2회 이상이면 정지)
    if (reportedUser.report_count >= 2) {
      reportedUser.status = UserStatus.STOP;
      console.log(`🚫 유저 상태 STOP으로 변경됨`);
    }

    // 유저 정보 저장
    await this.userService.save(reportedUser);
    console.log(`💾 유저 정보 저장 완료`);

    // 알림 메시지 전송
    const message =
      reportedUser.status === UserStatus.STOP
        ? "🚨 신고가 누적되어 계정이 정지되었습니다!"
        : "⚠️ 신고가 접수되었습니다. 주의해 주세요!";

    await this.notificationService.sendNotification({
      user: reportedUser,
      content: message,
    });

    console.log(`📢 알림 전송 완료 → ${reportedUser.nickname}: ${message}`);

    // 신고 상태를 처리됨으로 표시
    await this.markHandled(report);
    console.log(`📋 신고 상태 처리됨으로 변경`);

    return true; // 신고 처리 성공 시 true 반환
  }

  async markHandled(report: Report): Promise<void> {
    report.handled = true;
    await this.reportRepository.save(report);
  }
}
