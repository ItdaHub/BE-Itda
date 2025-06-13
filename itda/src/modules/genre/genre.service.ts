import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Genre } from "./entities/genre.entity";
import { Repository } from "typeorm";

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>
  ) {}

  async getAllGenres(): Promise<Genre[]> {
    return this.genreRepository.find();
  }
}
