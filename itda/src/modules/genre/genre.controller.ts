import { Controller, Get } from "@nestjs/common";
import { GenreService } from "./genre.service";
import { Genre } from "./genre.entity";

@Controller("categories")
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getAllGenres(): Promise<Genre[]> {
    return this.genreService.getAllGenres();
  }
}
