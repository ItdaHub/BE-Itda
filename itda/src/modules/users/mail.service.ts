import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // 이메일 전송을 위한 transporter 설정
    this.transporter = nodemailer.createTransport({
      service: "gmail", // 사용하고자 하는 이메일 서비스 (예: Gmail)
      auth: {
        user: "your-email@gmail.com", // 발송할 이메일 주소
        pass: "your-email-password", // 이메일 비밀번호
      },
    });
  }

  // 이메일 보내는 메서드
  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: "your-email@gmail.com", // 발송자
      to, // 수신자
      subject, // 제목
      text, // plain text 형식
      html, // HTML 형식 (선택사항)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}
