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
    novelId: number,
    chapterId: number
  ): Promise<{
    slides: { index: number; text: string }[];
    authorNickname: string;
    writerId: number;
    chapterNumber: number;
  }> {
    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
    });

    if (!novel) {
      throw new NotFoundException(`Novel with ID ${novelId} not found`);
    }

    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId, novel: { id: novelId } },
      relations: ["author"],
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }

    const slides = chapter.content
      .split(/\n{2,}/)
      .map((text, index) => ({
        index,
        text: text.trim(),
      }))
      .filter((slide) => slide.text.length > 0);

    return {
      slides,
      authorNickname: chapter.author?.nickname || "알 수 없음",
      writerId: chapter.author?.id,
      chapterNumber: chapter.chapter_number,
    };
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

    const alreadyWrote = await this.chapterRepository.findOne({
      where: {
        novel: { id: novelId },
        author: { id: user.id },
      },
    });

    if (alreadyWrote) {
      throw new Error("이미 이 소설에 이어쓴 기록이 있습니다.");
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

  async hasUserParticipatedInNovel(
    novelId: number,
    userId: number
  ): Promise<boolean> {
    const alreadyParticipated = await this.chapterRepository.findOne({
      where: {
        novel: { id: novelId },
        author: { id: userId },
      },
    });

    return !!alreadyParticipated;
  }
}
