// src/mail/mail.service.ts
import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_KEY,
      pass: process.env.NODEMAILER_PASSWORD_KEY,
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"웹소설 플랫폼" <${process.env.NODEMAILER_KEY}>`,
        to,
        subject,
        html,
      });

      console.log("✅ 메일 전송 완료:", info.response);
      return info;
    } catch (error) {
      console.error("❌ 메일 전송 실패:", error);
      throw error;
    }
  }
}
