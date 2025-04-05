import { Repository } from "typeorm";
import { Comment } from "./comment.entity";
import { User } from "../users/user.entity";
import { Novel } from "../novels/novel.entity";
import { Chapter } from "../chapter/chapter.entity";
import { Report } from "../reports/report.entity";
export declare class CommentsService {
    private readonly commentRepo;
    private readonly userRepo;
    private readonly novelRepo;
    private readonly chapterRepo;
    private readonly reportRepository;
    constructor(commentRepo: Repository<Comment>, userRepo: Repository<User>, novelRepo: Repository<Novel>, chapterRepo: Repository<Chapter>, reportRepository: Repository<Report>);
    createComment({ userId, content, novelId, chapterId, parentId, }: {
        userId: number;
        content: string;
        novelId: number;
        chapterId?: number;
        parentId?: number;
    }): Promise<Comment>;
    getComments(novelId: number, chapterId?: number, currentUserId?: number): Promise<{
        childComments: {
            id: number;
            writer: string;
            writerId: number;
            comment: string;
            date: Date;
            likeNum: number;
            isliked: boolean;
            parentId: number | null;
        }[];
        id: number;
        writer: string;
        writerId: number;
        comment: string;
        date: Date;
        likeNum: number;
        isliked: boolean;
        parentId: number | null;
    }[]>;
    deleteComment(id: number): Promise<{
        message: string;
    }>;
    reportComment(commentId: number, userId: number, reason: string): Promise<{
        message: string;
    }>;
    findByUser(userId: number): Promise<Comment[]>;
}
