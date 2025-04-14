// src/mail/mail.module.ts
import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";

@Module({
  providers: [MailService],
  exports: [MailService], // 다른 곳에서 쓰려면 export
})
export class MailModule {}
