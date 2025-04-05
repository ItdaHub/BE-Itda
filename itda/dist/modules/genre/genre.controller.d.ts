import { GenreService } from "./genre.service";
import { Genre } from "./genre.entity";
export declare class GenreController {
    private readonly genreService;
    constructor(genreService: GenreService);
    getAllGenres(): Promise<Genre[]>;
}
