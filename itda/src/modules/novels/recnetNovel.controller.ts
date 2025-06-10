import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { RecentNovelService } from "./recentNovel.service";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { RecentNovelDto } from "./dto/recentNovel.dto";

@Controller("novels/recent")
@UseGuards(JwtAuthGuard)
export class RecentNovelController {
  constructor(private readonly recentNovelService: RecentNovelService) {}

  @Post(":novelId")
  async addRecent(
    @Param("novelId") novelId: number,
    @Request() req
  ): Promise<void> {
    return this.recentNovelService.addRecentNovel(req.user, novelId);
  }

  @Get()
  async getRecent(@Request() req): Promise<RecentNovelDto[]> {
    const recent = await this.recentNovelService.getRecentNovels(req.user);
    return recent.map((item) => new RecentNovelDto(item));
  }
}
