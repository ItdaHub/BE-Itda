import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { NovelService } from "./novel.service";
import { Novel } from "./novel.entity";

@Controller("novels")
export class NovelController {
  constructor(private readonly novelService: NovelService) {}

  // ✅ 전체 소설 조회
  @Get()
  async getAllNovels(): Promise<Novel[]> {
    return this.novelService.getAllNovels();
  }

  // ✅ 특정 소설 조회 (ID를 숫자로 변환)
  @Get(":id")
  async getNovelById(@Param("id") id: string): Promise<Novel> {
    return this.novelService.getNovelById(parseInt(id, 10));
  }

  // ✅ 소설 생성
  @Post()
  async create(@Body() novelData: Partial<Novel>): Promise<Novel> {
    return this.novelService.create(novelData);
  }

  // ✅ 소설 삭제 (ID를 숫자로 변환)
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    return this.novelService.remove(parseInt(id, 10));
  }
}
