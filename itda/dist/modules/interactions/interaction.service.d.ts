import { Repository } from "typeorm";
import { Vote } from "./vote.entity";
import { Comment } from "./comment.entity";
import { Novel } from "../novels/novel.entity";
import { User } from "../users/user.entity";
import { Chapter } from "../novels/chapter.entity";
export declare class InteractionsService {
    private voteRepository;
    private commentRepository;
    private novelRepository;
    private userRepository;
    private chapterRepository;
    constructor(voteRepository: Repository<Vote>, commentRepository: Repository<Comment>, novelRepository: Repository<Novel>, userRepository: Repository<User>, chapterRepository: Repository<Chapter>);
    createVote({ novelId, userId, result, }: {
        novelId: number;
        userId: number;
        result: "agree" | "disagree";
    }): Promise<Vote>;
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
