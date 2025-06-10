import { CommentsService } from "./comment.service";
import { CreateCommentDto } from "./dto/createcomment.dto";
import { DeleteCommentsDto } from "./dto/deletecomments.dto";
import { ReportCommentDto } from "./dto/reportcomment.dto";
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto): Promise<import("./entities/comment.entity").Comment>;
    getNovelComments(req: any, novelId: number): Promise<{
        id: number;
        writer: string;
        writerId: number;
        comment: string;
        date: string | null;
        likeNum: number;
        isliked: boolean;
        parentId: number | null;
    }[]>;
    getChapterComments(req: any, chapterId: number): Promise<{
        id: number;
        writer: string;
        writerId: number;
        comment: string;
        date: string | null;
        likeNum: number;
        isliked: boolean;
        parentId: number | null;
    }[]>;
    deleteComments(dto: DeleteCommentsDto): Promise<void>;
    deleteComment(id: number): Promise<{
        message: string;
    }>;
    reportComment(commentId: number, dto: ReportCommentDto): Promise<{
        message: string;
    }>;
    getMyComments(req: any): Promise<import("./entities/comment.entity").Comment[]>;
}
