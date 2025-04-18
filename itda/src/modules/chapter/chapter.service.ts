import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import { Novel } from "../novels/novel.entity";
import { NovelStatus } from "../novels/novel.entity";

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,

    @InjectRepository(Novel)
    private readonly novelRepository: Repository<Novel>
  ) {}

  async getChaptersByNovel(novelId: number): Promise<
    {
      id: number;
      chapter_number: number;
      content: string;
      created_at: Date;
      nickname: string;
      comments: any[];
    }[]
  > {
    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
    });
    if (!novel) {
      throw new NotFoundException(`Novel with ID ${novelId} not found`);
    }

    const chapters = await this.chapterRepository.find({
      where: { novel: { id: novelId } },
      order: { chapter_number: "ASC" },
      relations: ["comments", "author"], // 👈 author join 추가
    });

    return chapters.map((chapter) => ({
      id: chapter.id,
      chapter_number: chapter.chapter_number,
      content: chapter.content,
      created_at: chapter.created_at,
      nickname: chapter.author?.nickname || "알 수 없음", // 👈 닉네임 포함
      comments: chapter.comments,
    }));
  }

  async getChapterContent(
    novelId: number,
    chapterId: number
  ): Promise<{
    slides: { index: number; text: string }[];
    authorNickname: string;
    writerId: number;
    chapterNumber: number;
    isLastChapter: boolean; // 👈 이거 추가
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

    // ✅ 소설 전체 챕터 수 가져오기
    const totalChapters = await this.chapterRepository.count({
      where: { novel: { id: novelId } },
    });

    // ✅ 현재 챕터가 마지막인지 판단
    const isLastChapter = chapter.chapter_number === totalChapters;

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
      isLastChapter,
    };
  }

  async createChapter(
    novelId: number,
    content: string,
    user: any,
    chapterNumber?: number
  ): Promise<Chapter> {
    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
      relations: ["chapters"],
    });

    if (!novel) {
      throw new NotFoundException(`Novel with ID ${novelId} not found`);
    }

    if (!user || !user.id) {
      throw new Error("유저 정보가 잘못되었습니다.");
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

    let newChapterNumber: number;

    if (chapterNumber) {
      newChapterNumber = chapterNumber;
    } else {
      const chapterCount = await this.chapterRepository.count({
        where: { novel: { id: novelId } },
      });
      console.log(`현재 소설의 총 챕터 수: ${chapterCount}`);
      newChapterNumber = chapterCount + 1;
    }

    console.log(`새로운 챕터 번호: ${newChapterNumber}`);

    const newChapter = this.chapterRepository.create({
      content,
      chapter_number: newChapterNumber,
      novel,
      author: user,
    });

    await this.chapterRepository.save(newChapter);

    // ✅ 상태 변경 로직 제거됨!

    return newChapter;
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
