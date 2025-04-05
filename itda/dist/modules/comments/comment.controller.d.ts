import { CommentsService } from "./comment.service";
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(body: any): Promise<import("./comment.entity").Comment>;
    getComments(novelId: number, chapterId?: number, userId?: number): Promise<{
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
    getMyComments(req: any): Promise<import("./comment.entity").Comment[]>;
}
