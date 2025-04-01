import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Novel } from "./novel.entity";

@Injectable()
export class NovelService {
  constructor(
    @InjectRepository(Novel)
    private readonly novelRepository: Repository<Novel>
  ) {}

  // ✅ 전체 소설 조회 (참여자, 챕터, 장르 포함)
  async getAllNovels(): Promise<Novel[]> {
    return await this.novelRepository.find({
      relations: [
        "creator",
        "genre",
        "participants",
        "chapters",
        "aiGeneratedImages",
      ],
    });
  }

  // ✅ 특정 소설 조회 (없으면 예외 발생)
  async getNovelById(id: number): Promise<Novel> {
    const novel = await this.novelRepository.findOne({
      where: { id },
      relations: [
        "creator",
        "genre",
        "participants",
        "chapters",
        "aiGeneratedImages",
      ],
    });

    if (!novel) {
      throw new NotFoundException(`Novel with ID ${id} not found`);
    }
    return novel;
  }

  // ✅ 소설 생성
  async create(novelData: Partial<Novel>): Promise<Novel> {
    const novel = this.novelRepository.create(novelData);
    return await this.novelRepository.save(novel);
  }

  // ✅ 소설 삭제
  async remove(id: number): Promise<void> {
    const result = await this.novelRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Novel with ID ${id} not found`);
    }
  }
}
