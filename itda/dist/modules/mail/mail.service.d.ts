export declare class MailService {
    private transporter;
    sendMail(to: string, subject: string, html: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
