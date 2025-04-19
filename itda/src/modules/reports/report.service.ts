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

  // 댓글 신고 시, 신고한 댓글 작성자 찾기
  async findReportedUserByComment(commentId: number): Promise<User | null> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ["user"],
    });

    return comment?.user ?? null; // 댓글을 작성한 유저 반환
  }

  async handleReport(reportId: number): Promise<boolean> {
    console.log(`신고 ID: ${reportId} 처리 시작`);

    const report = await this.findOne(reportId);
    if (!report) {
      console.log(`신고 ID: ${reportId} 찾을 수 없음`);
      return false;
    }
    console.log(`신고 데이터: ${JSON.stringify(report)}`);

    // reported_user_id가 null일 경우, 신고 대상 유저 찾기
    if (!report.reported_user_id) {
      // 예시로 댓글 신고라면, 댓글을 통해 신고한 유저를 찾을 수 있습니다.
      const reportedUser = await this.findReportedUserByComment(
        report.target_id
      ); // 예시로 댓글 ID로 유저를 찾는 함수 사용
      if (reportedUser) {
        report.reported_user_id = reportedUser.id; // 신고 대상 유저 ID 설정
      } else {
        console.log("신고 대상 유저를 찾을 수 없음");
        return false;
      }
    }

    // 신고 대상 유저 찾기
    const reportedUser = await this.findReportedUser(report);
    if (!reportedUser) {
      console.log(`신고 대상 유저를 찾을 수 없음: ${JSON.stringify(report)}`);
      return false;
    }
    console.log(`신고 대상 유저: ${JSON.stringify(reportedUser)}`);

    // 신고 횟수 증가 및 계정 정지 처리
    reportedUser.report_count += 1;
    console.log(`신고 횟수 증가 후: ${reportedUser.report_count}`);
    if (reportedUser.report_count >= 2) {
      reportedUser.status = UserStatus.STOP;
      console.log(`유저 상태 변경: BANNED`);
    }

    // 유저 정보 저장
    await this.userService.save(reportedUser);
    console.log(`유저 정보 저장 완료: ${JSON.stringify(reportedUser)}`);

    // 알림 메시지 준비 및 전송
    const message =
      reportedUser.status === UserStatus.STOP
        ? "🚨 신고가 누적되어 계정이 정지되었습니다!"
        : "⚠️ 신고가 접수되었습니다. 주의해 주세요!";

    console.log(`알림 내용: ${message}`);

    // 알림 전송
    await this.notificationService.sendNotification({
      user: reportedUser,
      content: message,
    });
    console.log(`알림 전송 완료`);

    return true;
  }
}
