import { Novel } from "src/modules/novels/entities/novel.entity";
export declare class Genre {
    id: number;
    name: string;
    value: string;
    novels: Novel[];
}
