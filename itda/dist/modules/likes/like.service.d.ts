import { EntityManager } from "typeorm";
import { Like } from "./like.entity";
import { Novel } from "../novels/novel.entity";
export declare class LikeService {
    private readonly entityManager;
    constructor(entityManager: EntityManager);
    likeNovel(userId: number, novelId: number): Promise<Like>;
    unlikeNovel(userId: number, novelId: number): Promise<void>;
    likeComment(userId: number, commentId: number): Promise<Like>;
    unlikeComment(userId: number, commentId: number): Promise<void>;
    countNovelLikes(novelId: number): Promise<number>;
    countCommentLikes(commentId: number): Promise<number>;
    getLikedNovels(userId: number): Promise<Novel[]>;
    private findUserById;
}
