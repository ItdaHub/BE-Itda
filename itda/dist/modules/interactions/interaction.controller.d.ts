import { InteractionsService } from "./interaction.service";
export declare class InteractionsController {
    private readonly interactionsService;
    constructor(interactionsService: InteractionsService);
    createComment(createCommentDto: {
        novelId: number;
        chapterId?: number;
        userId: number;
        content: string;
        parentCommentId?: number;
    }): Promise<import("../comments/comment.entity").Comment>;
    getCommentsByNovel(novelId: number): Promise<import("../comments/comment.entity").Comment[]>;
    deleteComment(commentId: number): Promise<import("typeorm").DeleteResult>;
}
