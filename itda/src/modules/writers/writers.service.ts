import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chapter } from "../chapter/chapter.entity";
import { Repository } from "typeorm";

@Injectable()
export class WritersService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>
  ) {}

  async getNicknameByChapterId(chapterId: number): Promise<string> {
    const chapter = await this.chapterRepo.findOne({
      where: { id: chapterId },
      relations: ["author"], // 반드시 relations 지정
    });

    if (!chapter || !chapter.author) {
      throw new NotFoundException("해당 챕터 또는 작가가 존재하지 않습니다.");
    }

    return chapter.author.nickname;
  }
}
