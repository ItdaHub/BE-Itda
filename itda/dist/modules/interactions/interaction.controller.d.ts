import { InteractionsService } from "./interaction.service";
export declare class InteractionsController {
    private readonly interactionsService;
    constructor(interactionsService: InteractionsService);
    createVote(createVoteDto: {
        novelId: number;
        userId: number;
        result: "agree" | "disagree";
    }): Promise<import("./vote.entity").Vote>;
    createComment(createCommentDto: {
        novelId: number;
        chapterId?: number;
        userId: number;
        content: string;
        parentCommentId?: number;
    }): Promise<import("./comment.entity").Comment>;
    getCommentsByNovel(novelId: number): Promise<import("./comment.entity").Comment[]>;
    deleteComment(commentId: number): Promise<import("typeorm").DeleteResult>;
}
