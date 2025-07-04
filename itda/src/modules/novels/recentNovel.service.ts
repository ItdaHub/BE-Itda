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
    private recentNovelRepository: Repository<RecentNovel>,
    @InjectRepository(Novel)
    private novelRepository: Repository<Novel>
  ) {}

  async addRecentNovel(
    user: User,
    novelId: number,
    chapterNumber: number
  ): Promise<void> {
    const novel = await this.novelRepository.findOneByOrFail({ id: novelId });

    await this.recentNovelRepository.upsert(
      {
        user: { id: user.id },
        novel: { id: novel.id },
        chapterNumber,
        viewedAt: new Date(),
      },
      ["userId", "novelId", "chapterNumber"]
    );
  }

  async getRecentNovels(user: User, limit = 20): Promise<RecentNovel[]> {
    const recentList = await this.recentNovelRepository.find({
      where: { user: { id: user.id } },
      order: { viewedAt: "DESC" },
      take: limit,
      relations: ["user", "novel"],
    });
    console.log("recentList:", recentList);
    return recentList;
  }
}
