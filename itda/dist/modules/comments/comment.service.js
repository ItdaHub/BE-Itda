"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./comment.entity");
const user_entity_1 = require("../users/user.entity");
const novel_entity_1 = require("../novels/novel.entity");
const chapter_entity_1 = require("../chapter/chapter.entity");
const report_entity_1 = require("../reports/report.entity");
let CommentsService = class CommentsService {
    commentRepo;
    userRepo;
    novelRepo;
    chapterRepo;
    reportRepository;
    constructor(commentRepo, userRepo, novelRepo, chapterRepo, reportRepository) {
        this.commentRepo = commentRepo;
        this.userRepo = userRepo;
        this.novelRepo = novelRepo;
        this.chapterRepo = chapterRepo;
        this.reportRepository = reportRepository;
    }
    async createComment({ userId, content, novelId, chapterId, parentId, }) {
        const user = await this.userRepo.findOneByOrFail({ id: userId });
        const novel = await this.novelRepo.findOneByOrFail({ id: novelId });
        const chapter = chapterId
            ? await this.chapterRepo.findOneBy({ id: chapterId })
            : null;
        const parent = parentId
            ? await this.commentRepo.findOneBy({ id: parentId })
            : null;
        const newComment = this.commentRepo.create({
            user,
            novel,
            chapter,
            content,
            parent_comment: parent,
        });
        return await this.commentRepo.save(newComment);
    }
    async getComments(novelId, chapterId, currentUserId) {
        const whereCondition = {
            novel: { id: novelId },
            parent_comment: (0, typeorm_2.IsNull)(),
        };
        if (chapterId) {
            whereCondition.chapter = { id: chapterId };
        }
        const rootComments = await this.commentRepo.find({
            where: whereCondition,
            relations: [
                "user",
                "likes",
                "likes.user",
                "childComments",
                "childComments.user",
                "childComments.likes",
                "childComments.likes.user",
                "childComments.parent_comment",
                "parent_comment",
            ],
            order: { created_at: "ASC" },
        });
        const formatComment = (comment) => {
            const createdAt = comment.created_at instanceof Date
                ? comment.created_at.toISOString()
                : null;
            const isLikedByUser = currentUserId
                ? comment.likes?.some((like) => like.user?.id === currentUserId)
                : false;
            return {
                id: comment.id,
                writer: comment.user?.nickname ?? comment.user?.email ?? "익명",
                writerId: comment.user?.id ?? null,
                comment: comment.content,
                date: createdAt,
                likeNum: comment.likes?.length ?? 0,
                isliked: isLikedByUser,
                parentId: comment.parent_comment?.id ?? null,
            };
        };
        const flatComments = rootComments.flatMap((root) => {
            console.log("🧷 루트 댓글:", root.id, root.likes?.map((l) => l.user?.id));
            const rootFormatted = formatComment(root);
            const childFormatted = (root.childComments ?? []).map((child) => {
                console.log("↪️ 대댓글:", child.id, child.likes?.map((l) => l.user?.id));
                return formatComment(child);
            });
            return [rootFormatted, ...childFormatted];
        });
        return flatComments;
    }
    async deleteComment(id) {
        const comment = await this.commentRepo.findOne({
            where: { id },
            relations: ["childComments"],
        });
        if (!comment) {
            throw new Error("댓글을 찾을 수 없습니다.");
        }
        if (comment.childComments && comment.childComments.length > 0) {
            await this.commentRepo.remove(comment.childComments);
        }
        await this.commentRepo.remove(comment);
        return { message: "댓글 및 대댓글이 삭제되었습니다." };
    }
    async reportComment(commentId, userId, reason) {
        const alreadyReported = await this.reportRepository.findOne({
            where: {
                reporter: { id: userId },
                target_type: report_entity_1.TargetType.COMMENT,
                target_id: commentId,
            },
        });
        if (alreadyReported) {
            throw new Error("이미 신고한 댓글입니다.");
        }
        const reporter = await this.userRepo.findOneByOrFail({ id: userId });
        const report = this.reportRepository.create({
            reporter,
            target_type: report_entity_1.TargetType.COMMENT,
            target_id: commentId,
            reason,
        });
        await this.reportRepository.save(report);
        return { message: "댓글 신고가 접수되었습니다." };
    }
    async findByUser(userId) {
        return this.commentRepo.find({
            where: { user: { id: userId } },
            relations: ["novel", "chapter"],
            order: { created_at: "DESC" },
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(novel_entity_1.Novel)),
    __param(3, (0, typeorm_1.InjectRepository)(chapter_entity_1.Chapter)),
    __param(4, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommentsService);
//# sourceMappingURL=comment.service.js.map