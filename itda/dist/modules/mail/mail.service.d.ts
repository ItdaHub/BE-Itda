import { MailerService } from "@nestjs-modules/mailer";
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
}
