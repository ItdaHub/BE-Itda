import { EntityManager } from "typeorm";
import { Like } from "./like.entity";
import { Novel } from "../novels/novel.entity";
export declare class LikeService {
    private readonly entityManager;
    constructor(entityManager: EntityManager);
    likeNovel(userId: number, novelId: number): Promise<Like>;
    unlikeNovel(userId: number, novelId: number): Promise<void>;
    toggleNovelLike(userId: number, novelId: number): Promise<{
        liked: boolean;
    }>;
    likeComment(userId: number, commentId: number): Promise<Like>;
    unlikeComment(userId: number, commentId: number): Promise<void>;
    toggleCommentLike(userId: number, commentId: number): Promise<{
        liked: boolean;
    }>;
    countNovelLikes(novelId: number): Promise<number>;
    countCommentLikes(commentId: number): Promise<number>;
    getLikedNovels(userId: number): Promise<Novel[]>;
    private findUserById;
    private findNovelById;
    private findCommentById;
    findLikedNovels(userId: number): Promise<Novel[]>;
}
