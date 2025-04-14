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
    user: any,
    chapterNumber?: number // 이어쓰기 시, 해당 챕터 번호를 전달받음
  ): Promise<Chapter> {
    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
      relations: ["chapters"],
    });

    if (!novel) {
      throw new NotFoundException(`Novel with ID ${novelId} not found`);
    }

    // 이미 이어쓴 기록이 있는지 확인
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
      // 이어쓰기인 경우: 전달받은 chapterNumber를 사용
      newChapterNumber = chapterNumber;
    } else {
      // 새로 쓰는 경우: 현재 소설의 챕터 수 + 1로 설정
      const chapterCount = await this.chapterRepository.count({
        where: { novel: { id: novelId } },
      });
      console.log(`현재 소설의 총 챕터 수: ${chapterCount}`); // 현재 챕터 수 출력
      newChapterNumber = chapterCount + 1;
    }

    console.log(`새로운 챕터 번호: ${newChapterNumber}`); // 새로운 챕터 번호 출력

    const newChapter = this.chapterRepository.create({
      content,
      chapter_number: newChapterNumber, // 챕터 번호 설정
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
