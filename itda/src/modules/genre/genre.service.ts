import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Genre } from "./genre.entity";
import { Repository } from "typeorm";

@Injectable()
export class GenreService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>
  ) {}

  async getAllGenres(): Promise<Genre[]> {
    return this.genreRepo.find();
  }

  // ✅ 장르 시드 데이터 삽입
  async seedGenres() {
    const genres = ["로맨스", "판타지", "무협", "스릴러"];
    for (const name of genres) {
      const exists = await this.genreRepo.findOne({ where: { name } });
      if (!exists) {
        const genre = this.genreRepo.create({ name });
        await this.genreRepo.save(genre);
        console.log(`✅ '${name}' 장르 저장 완료`);
      }
    }
  }

  // ✅ 앱 시작 시 실행됨
  async onApplicationBootstrap() {
    await this.seedGenres();
  }
}
