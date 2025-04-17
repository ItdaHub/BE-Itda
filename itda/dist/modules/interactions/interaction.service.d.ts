import { Repository } from "typeorm";
import { Comment } from "../comments/comment.entity";
import { Novel } from "../novels/novel.entity";
import { User } from "../users/user.entity";
import { Chapter } from "../chapter/chapter.entity";
export declare class InteractionsService {
    private commentRepository;
    private novelRepository;
    private userRepository;
    private chapterRepository;
    constructor(commentRepository: Repository<Comment>, novelRepository: Repository<Novel>, userRepository: Repository<User>, chapterRepository: Repository<Chapter>);
    createComment({ novelId, chapterId, userId, content, parentCommentId, }: {
        novelId: number;
        chapterId?: number;
        userId: number;
        content: string;
        parentCommentId?: number;
    }): Promise<Comment>;
    getCommentsByNovel(novelId: number): Promise<Comment[]>;
    deleteComment(commentId: number): Promise<import("typeorm").DeleteResult>;
}
