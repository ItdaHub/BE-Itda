import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import { Novel } from "../novels/novel.entity";
import { AiService } from "../ai/ai.service";

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(Novel)
    private readonly novelRepository: Repository<Novel>,
    private readonly aiService: AiService
  ) {}

  async getChaptersByNovel(novelId: number): Promise<
    {
      id: number;
      chapter_number: number;
      content: string;
      created_at: Date;
      nickname: string;
      comments: any[];
      isPublished: boolean;
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
      relations: ["comments", "author"],
    });

    return chapters.map((chapter) => ({
      id: chapter.id,
      chapter_number: chapter.chapter_number,
      content: chapter.content,
      created_at: chapter.created_at,
      nickname: chapter.author?.nickname || "알 수 없음",
      comments: chapter.comments,
      isPublished: novel.isPublished,
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
    isLastChapter: boolean;
    isPublished: boolean;
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

    const totalChapters = await this.chapterRepository.count({
      where: { novel: { id: novelId } },
    });

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
      isPublished: novel.isPublished,
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
      relations: ["chapters", "genre"],
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
      newChapterNumber = chapterCount + 1;
    }

    if (newChapterNumber === 1) {
      const { summary, imageUrl } = await this.aiService.createNovelWithAi(
        content,
        user.id,
        novel.genre.id,
        novel.max_participants,
        novel.type
      );

      novel.cover_image = imageUrl;
      await this.novelRepository.save(novel);
    }

    const newChapter = this.chapterRepository.create({
      content,
      chapter_number: newChapterNumber,
      novel,
      author: user,
    });

    await this.chapterRepository.save(newChapter);

    console.log("Calling updatePaidStatus for novelId:", novelId);
    // 챕터 저장 후에 유료 상태를 업데이트
    await this.updatePaidStatus(novelId);

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

  async checkIsPaid(novelId: number, chapterId: number): Promise<boolean> {
    const chapter = await this.chapterRepository.findOne({
      where: {
        id: chapterId,
        novel: { id: novelId },
      },
    });

    if (!chapter) {
      throw new NotFoundException("해당 챕터를 찾을 수 없습니다.");
    }

    return chapter.isPaid ?? false; // isPaid 필드 있는지 확인!
  }

  async updatePaidStatus(novelId: number): Promise<void> {
    console.log("Executing updatePaidStatus for novelId:", novelId);

    const chapters = await this.chapterRepository.find({
      where: { novel: { id: novelId } },
      order: { chapter_number: "ASC" },
    });

    if (!chapters || chapters.length === 0) {
      console.log("No chapters found for novelId:", novelId);
      return;
    }

    console.log("Found chapters:", chapters);

    const totalChapters = chapters.length;
    const paidCount = Math.floor(totalChapters * (2 / 3)); // 2/3만큼 유료
    const paidStartIndex = totalChapters - paidCount; // 유료 시작 인덱스

    console.log(`Paid chapters start from index: ${paidStartIndex}`);

    // 2/3 이후부터 유료로 설정
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const isPaid = i >= paidStartIndex; // 뒤에서부터 유료 설정

      if (chapter.isPaid !== isPaid) {
        chapter.isPaid = isPaid;
        await this.chapterRepository.save(chapter);
        console.log(
          `✅ Chapter ${chapter.chapter_number} is set to ${isPaid ? "paid" : "free"}`
        );
      }
    }
  }
}
