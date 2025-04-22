import { ApiProperty } from "@nestjs/swagger";

export class AnnouncementWithAdminDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: ["urgent", "normal"] })
  priority: "urgent" | "normal";

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({
    type: () => ({
      id: Number,
      email: String,
      nickname: String,
    }),
  })
  admin: {
    id: number;
    email: string;
    nickname: string;
  };

  @ApiProperty({ description: "해당 사용자가 읽었는지 여부", type: Boolean })
  isRead: boolean;
}
