"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const dotenv = require("dotenv");
dotenv.config();
let MailService = class MailService {
    mailerService;
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendPasswordResetEmail(email, token) {
        const resetUrl = `http://localhost:3000/update-password?token=${token}`;
        try {
            await this.mailerService.sendMail({
                to: email,
                from: `"ITDA" <${process.env.NODEMAILER_EMAIL}>`,
                subject: "[ITDA] 비밀번호 재설정 안내",
                text: `비밀번호 재설정을 위해 다음 링크를 클릭하세요: ${resetUrl}`,
                html: `
          <div>
            <h2>비밀번호 재설정을 요청하셨나요?</h2>
            <p>아래 버튼을 클릭하여 비밀번호를 재설정하세요.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">비밀번호 재설정</a>
            <p>이 링크는 10분간 유효합니다.</p>
          </div>
        `,
            });
        }
        catch (error) {
            console.error("이메일 전송 실패:", error);
            throw new common_1.InternalServerErrorException("이메일 전송에 실패했습니다.");
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map