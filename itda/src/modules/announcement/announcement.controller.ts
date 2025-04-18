import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, // 추가
  UseGuards,
  Req,
} from "@nestjs/common";
import { AnnouncementService } from "./announcement.service";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { Request } from "express";
import { Announcement } from "./announcement.entity";
import { User } from "../users/user.entity";

@Controller("announcement")
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @UseGuards(JwtAuthGuard)
  @Post("register")
  async createAnnouncement(@Req() req: Request, @Body() body: any) {
    const { title, content } = body;
    const admin = req.user as User;
    return this.announcementService.createAnnouncement(title, content, admin);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteAnnouncement(@Param("id") id: string) {
    return this.announcementService.deleteAnnouncement(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllAnnouncements() {
    return this.announcementService.getAllAnnouncements();
  }

  @Get(":id")
  async getAnnouncement(@Param("id") id: string) {
    console.log("🚀 GET /announcement/:id 요청 들어옴, id:", id);
    return this.announcementService.getAnnouncementById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateAnnouncement(
    @Param("id") id: string,
    @Body() body: { title: string; content: string }
  ) {
    const { title, content } = body;
    return this.announcementService.updateAnnouncement(
      Number(id),
      title,
      content
    );
  }
}
