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
    private novelRepo: Repository<Novel>
  ) {}

  async addRecentNovel(
    user: User,
    novelId: number,
    chapterNumber: number
  ): Promise<void> {
    const novel = await this.novelRepo.findOneByOrFail({ id: novelId });

    await this.recentNovelRepository.upsert(
      {
        user: { id: user.id }, // user 엔티티가 아니라 id만 넣어도 됨
        novel: { id: novel.id },
        chapterNumber,
        viewedAt: new Date(),
      },
      ["userId", "novelId", "chapterNumber"] // 실제 DB 컬럼명
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
