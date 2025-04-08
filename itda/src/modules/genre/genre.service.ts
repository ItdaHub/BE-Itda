import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Genre } from "./genre.entity";
import { Repository } from "typeorm";

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>
  ) {}

  async getAllGenres(): Promise<Genre[]> {
    return this.genreRepo.find();
  }

  // ✅ 수동 호출용 시드 데이터 삽입 함수
  async seedGenres() {
    const genres = [
      { name: "로맨스", value: "romance" },
      { name: "판타지", value: "fantasy" },
      { name: "무협", value: "martial" },
      { name: "스릴러", value: "thriller" },
    ];

    for (const genreData of genres) {
      const exists = await this.genreRepo.findOne({
        where: { name: genreData.name },
      });
      if (!exists) {
        const genre = this.genreRepo.create(genreData);
        await this.genreRepo.save(genre);
        console.log(`✅ '${genreData.name}' 장르 저장 완료`);
      }
    }
  }
}
