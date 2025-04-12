import { EntityManager } from "typeorm";
export declare class LikeService {
    private readonly entityManager;
    constructor(entityManager: EntityManager);
    toggleNovelLike(userId: number, novelId: number): Promise<{
        liked: boolean;
    }>;
    toggleCommentLike(userId: number, commentId: number): Promise<{
        liked: boolean;
    }>;
    countNovelLikes(novelId: number): Promise<number>;
    countCommentLikes(commentId: number): Promise<number>;
    findLikedNovels(userId: number): Promise<any[]>;
    private findUserById;
    private findNovelById;
    private findCommentById;
}
