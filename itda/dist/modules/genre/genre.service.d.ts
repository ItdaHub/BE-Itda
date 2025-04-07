import { OnApplicationBootstrap } from "@nestjs/common";
import { Genre } from "./genre.entity";
import { Repository } from "typeorm";
export declare class GenreService implements OnApplicationBootstrap {
    private readonly genreRepo;
    constructor(genreRepo: Repository<Genre>);
    getAllGenres(): Promise<Genre[]>;
    seedGenres(): Promise<void>;
    onApplicationBootstrap(): Promise<void>;
}
