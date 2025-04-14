import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // 비밀번호 수정 페이지로 URL 변경
    const resetUrl = `http://localhost:3000/update-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        from: `"ITDA" <${process.env.NODEMAILER_EMAIL}>`, // ex) ITDA <itda@gmail.com>

        subject: "[ITDA] 비밀번호 재설정 안내",
        text: `비밀번호 재설정을 위해 다음 링크를 클릭하세요: ${resetUrl}`, // text 버전
        html: `
          <div>
            <h2>비밀번호 재설정을 요청하셨나요?</h2>
            <p>아래 버튼을 클릭하여 비밀번호를 재설정하세요.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">비밀번호 재설정</a>
            <p>이 링크는 10분간 유효합니다.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("이메일 전송 실패:", error);
      throw new InternalServerErrorException("이메일 전송에 실패했습니다.");
    }
  }
}
