import { Genre } from "./entities/genre.entity";
import { Repository } from "typeorm";
export declare class GenreService {
    private readonly genreRepository;
    constructor(genreRepository: Repository<Genre>);
    getAllGenres(): Promise<Genre[]>;
}
