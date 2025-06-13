import { Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { User } from "../users/entities/user.entity";
import { Novel } from "../novels/entities/novel.entity";
import { Chapter } from "../chapter/entities/chapter.entity";
import { Report } from "../reports/entities/report.entity";
export declare class CommentsService {
    private readonly commentRepository;
    private readonly userRepository;
    private readonly novelRepository;
    private readonly chapterRepository;
    private readonly reportRepository;
    constructor(commentRepository: Repository<Comment>, userRepository: Repository<User>, novelRepository: Repository<Novel>, chapterRepository: Repository<Chapter>, reportRepository: Repository<Report>);
    createComment({ userId, content, novelId, chapterId, parentId, }: {
        userId: number;
        content: string;
        novelId?: number;
        chapterId?: number;
        parentId?: number;
    }): Promise<Comment>;
    getComments(novelId?: number, chapterId?: number, currentUserId?: number): Promise<{
        id: number;
        writer: string;
        writerId: number;
        comment: string;
        date: string | null;
        likeNum: number;
        isliked: boolean;
        parentId: number | null;
    }[]>;
    deleteComment(id: number): Promise<{
        message: string;
    }>;
    deleteComments(ids: number[]): Promise<void>;
    reportComment(commentId: number, userId: number, reason: string): Promise<{
        message: string;
    }>;
    findByUser(userId: number): Promise<Comment[]>;
}
