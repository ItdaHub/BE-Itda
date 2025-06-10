import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RecentNovel } from "./entities/recentNovel.entity";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Novel } from "./entities/novel.entity";

@Injectable()
export class RecentNovelService {
  constructor(
    @InjectRepository(RecentNovel)
    private recentNovelRepo: Repository<RecentNovel>,
    @InjectRepository(Novel)
    private novelRepo: Repository<Novel>
  ) {}

  async addRecentNovel(
    user: User,
    novelId: number,
    chapterNumber: number
  ): Promise<void> {
    const novel = await this.novelRepo.findOneByOrFail({ id: novelId });

    await this.recentNovelRepo.upsert(
      {
        user,
        novel,
        chapterNumber,
        viewedAt: new Date(),
      },
      ["user", "novel", "chapterNumber"]
    );
  }

  async getRecentNovels(user: User, limit = 20): Promise<RecentNovel[]> {
    return this.recentNovelRepo.find({
      where: { user: { id: user.id } },
      order: { viewedAt: "DESC" },
      take: limit,
      relations: ["user", "novel"],
    });
  }
}
