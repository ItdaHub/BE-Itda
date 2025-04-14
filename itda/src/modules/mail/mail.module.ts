import { Module } from "@nestjs/common";
import { MailService } from "./mail.service"; // MailService 임포트

@Module({
  providers: [MailService], // MailService를 제공
  exports: [MailService], // 다른 모듈에서 사용할 수 있도록 내보냄
})
export class MailModule {}
