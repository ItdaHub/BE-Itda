import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import { Novel } from "../novels/novel.entity";

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,

    @InjectRepository(Novel)
    private readonly novelRepository: Repository<Novel>
  ) {}

  async getChaptersByNovel(novelId: number): Promise<Chapter[]> {
    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
    });
    if (!novel) {
      throw new NotFoundException(`Novel with ID ${novelId} not found`);
    }

    return await this.chapterRepository.find({
      where: { novel: { id: novelId } },
      order: { chapter_number: "ASC" }, // 1화부터 정렬
      relations: ["comments"], // 댓글 수 계산용
    });
  }

  async getChapterContent(
    chapterId: number
  ): Promise<{ index: number; text: string }[] | null> {
    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId },
    });

    if (!chapter) return null;

    // 내용 분할
    const slides = chapter.content.split(/\n{2,}/).map((text, index) => ({
      index,
      text: text.trim(),
    }));

    return slides;
  }
}
