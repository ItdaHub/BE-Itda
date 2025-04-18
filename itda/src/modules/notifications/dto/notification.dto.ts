import { User } from "../../users/user.entity";
import { Novel } from "../../novels/novel.entity";
import { Report } from "../../reports/report.entity";

export class SendNotificationDto {
  user: User;
  content: string;
  novel?: Novel | null;
  report?: Report | null;
}
