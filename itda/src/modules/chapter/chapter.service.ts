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

  // async getChapterContent(
  //   novelId: number,
  //   chapterId: number
  // ): Promise<{ index: number; text: string; isPaid: boolean }[]> {
  //   const novel = await this.novelRepository.findOne({
  //     where: { id: novelId },
  //   });

  //   if (!novel) {
  //     throw new NotFoundException(`Novel with ID ${novelId} not found`);
  //   }

  //   const chapter = await this.chapterRepository.findOne({
  //     where: { id: chapterId, novel: { id: novelId } },
  //   });

  //   if (!chapter) {
  //     throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
  //   }

  //   const rawSlides = chapter.content
  //     .split(/\n{2,}/)
  //     .map((text) => text.trim())
  //     .filter((text) => text.length > 0);

  //   const paidStartIndex = Math.floor(rawSlides.length / 2);

  //   const slides = rawSlides.map((text, index) => ({
  //     index,
  //     text,
  //     isPaid: index >= paidStartIndex,
  //   }));

  //   return slides;
  // }
  async getChapterContent(
    novelId: number,
    chapterId: number
  ): Promise<{
    slides: { index: number; text: string }[];
    authorNickname: string;
    writerId: number;
  }> {
    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
    });

    if (!novel) {
      throw new NotFoundException(`Novel with ID ${novelId} not found`);
    }

    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId, novel: { id: novelId } },
      relations: ["author"], // author 관계 포함
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
