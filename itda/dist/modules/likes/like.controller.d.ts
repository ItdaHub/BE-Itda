import { LikeService } from "./like.service";
import { Like } from "./like.entity";
export declare class LikeController {
    private readonly likeService;
    constructor(likeService: LikeService);
    likeNovel(userId: number, novelId: number): Promise<Like>;
    unlikeNovel(userId: number, novelId: number): Promise<void>;
    likeComment(userId: number, commentId: number): Promise<Like>;
    unlikeComment(userId: number, commentId: number): Promise<void>;
    countNovelLikes(novelId: number): Promise<number>;
    countCommentLikes(commentId: number): Promise<number>;
}
