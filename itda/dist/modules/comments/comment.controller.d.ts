import { CommentsService } from "./comment.service";
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(body: any): Promise<import("./comment.entity").Comment>;
    getComments(req: any, novelId: number, chapterId?: number, userId?: number): Promise<{
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
    reportComment(commentId: number, userId: number, reason: string): Promise<{
        message: string;
    }>;
    getMyComments(req: any): Promise<import("./comment.entity").Comment[]>;
}
