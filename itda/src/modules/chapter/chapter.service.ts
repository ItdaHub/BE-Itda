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
      order: { chapter_number: "ASC" },
      relations: ["comments"],
    });
  }

  async getChapterContent(
    chapterId: number
  ): Promise<{ index: number; text: string }[] | null> {
    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId },
    });

    if (!chapter) return null;

    const slides = chapter.content.split(/\n{2,}/).map((text, index) => ({
      index,
      text: text.trim(),
    }));

    return slides;
  }

  async createChapter(
    novelId: number,
    content: string,
    user: any
  ): Promise<Chapter> {
    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
      relations: ["chapters"],
    });

    if (!novel) {
      throw new NotFoundException(`Novel with ID ${novelId} not found`);
    }

    const chapterCount = await this.chapterRepository.count({
      where: { novel: { id: novelId } },
    });

    const newChapter = this.chapterRepository.create({
      content,
      chapter_number: chapterCount + 1,
      novel,
      author: user,
    });

    return await this.chapterRepository.save(newChapter);
  }
}
