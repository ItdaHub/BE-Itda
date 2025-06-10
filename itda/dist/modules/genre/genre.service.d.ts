import { Genre } from "./entities/genre.entity";
import { Repository } from "typeorm";
export declare class GenreService {
    private readonly genreRepo;
    constructor(genreRepo: Repository<Genre>);
    getAllGenres(): Promise<Genre[]>;
}
