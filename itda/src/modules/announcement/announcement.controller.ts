import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { AnnouncementService } from "./announcement.service";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { Request } from "express";
import { Announcement } from "./entities/announcement.entity";
import { User } from "../users/entities/user.entity";

@ApiTags("공지사항")
@Controller("announcement")
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @UseGuards(JwtAuthGuard)
  @Post("register")
  @ApiOperation({ summary: "공지사항 등록 (관리자용)" })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "서비스 점검 안내" },
        content: {
          type: "string",
          example: "4월 23일 오전 2시 서비스 점검이 있습니다.",
        },
        priority: {
          type: "string",
          enum: ["urgent", "normal"],
          example: "urgent",
        },
      },
    },
  })
  async createAnnouncement(@Req() req: Request, @Body() body: any) {
    console.log("📢 컨트롤러 register body:", body);
    const { title, content, priority } = body;
    const admin = req.user as User;
    return this.announcementService.createAnnouncement(
      title,
      content,
      admin,
      priority
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @ApiOperation({ summary: "공지사항 삭제 (관리자용)" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "삭제할 공지사항 ID" })
  async deleteAnnouncement(@Param("id") id: string) {
    return this.announcementService.deleteAnnouncement(Number(id));
  }

  @Get()
  @ApiOperation({ summary: "모든 공지사항 조회 (관리자용)" })
  @ApiBearerAuth()
  async getAllAnnouncements() {
    return this.announcementService.getAllAnnouncements();
  }

  @Get(":id")
  @ApiOperation({ summary: "공지사항 단건 조회 (사용자용)" })
  @ApiParam({ name: "id", description: "조회할 공지사항 ID" })
  async getAnnouncement(@Param("id") id: string) {
    console.log("🚀 GET /announcement/:id 요청 들어옴, id:", id);
    return this.announcementService.getAnnouncementById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  @ApiOperation({ summary: "공지사항 수정 (관리자용)" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "수정할 공지사항 ID" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "업데이트 안내" },
        content: { type: "string", example: "새로운 기능이 추가됩니다." },
        priority: {
          type: "string",
          enum: ["urgent", "normal"],
          example: "normal",
        },
      },
    },
  })
  async updateAnnouncement(
    @Param("id") id: string,
    @Body()
    body: { title: string; content: string; priority?: "urgent" | "normal" }
  ) {
    const { title, content, priority } = body;
    return this.announcementService.updateAnnouncement(
      Number(id),
      title,
      content,
      priority
    );
  }

  @Post("/read/:id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "공지사항 읽음 처리 (사용자용)" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "읽음 처리할 공지사항 ID" })
  async markAsRead(@Param("id") id: number, @Req() req) {
    const user = req.user;
    return this.announcementService.markAsRead(id, user.id);
  }
}
