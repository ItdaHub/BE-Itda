import { LikeService } from "./like.service";
export declare class LikeController {
    private readonly likeService;
    constructor(likeService: LikeService);
    toggleNovelLike(req: any, novelId: number): Promise<{
        liked: boolean;
    }>;
    toggleCommentLike(req: any, commentId: number): Promise<{
        liked: boolean;
    }>;
    getMyLikes(req: any): Promise<import("../novels/novel.entity").Novel[]>;
    countNovelLikes(novelId: number): Promise<number>;
    countCommentLikes(commentId: number): Promise<number>;
}
