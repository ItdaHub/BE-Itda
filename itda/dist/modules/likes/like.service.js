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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const like_entity_1 = require("./entities/like.entity");
const user_entity_1 = require("../users/entities/user.entity");
const novel_entity_1 = require("../novels/entities/novel.entity");
const comment_entity_1 = require("../comments/entities/comment.entity");
let LikeService = class LikeService {
    entityManager;
    constructor(entityManager) {
        this.entityManager = entityManager;
    }
    async toggleNovelLike(userId, novelId) {
        const existing = await this.entityManager.findOne(like_entity_1.Like, {
            where: {
                user: { id: userId },
                novel: { id: novelId },
            },
        });
        if (existing) {
            await this.entityManager.remove(existing);
            return { liked: false };
        }
        else {
            const user = await this.findUserById(userId);
            const novel = await this.findNovelById(novelId);
            const like = this.entityManager.create(like_entity_1.Like, {
                user,
                novel,
                target_type: "novel",
            });
            try {
                await this.entityManager.save(like);
                return { liked: true };
            }
            catch (error) {
                if (error.code === "ER_DUP_ENTRY") {
                    throw new common_1.ConflictException("이미 좋아요한 소설입니다.");
                }
                throw error;
            }
        }
    }
    async toggleCommentLike(userId, commentId) {
        const existing = await this.entityManager.findOne(like_entity_1.Like, {
            where: {
                user: { id: userId },
                comment: { id: commentId },
            },
        });
        if (existing) {
            await this.entityManager.remove(existing);
            return { liked: false };
        }
        else {
            const user = await this.findUserById(userId);
            const comment = await this.findCommentById(commentId);
            const like = this.entityManager.create(like_entity_1.Like, {
                user,
                comment,
                target_type: "comment",
            });
            try {
                await this.entityManager.save(like);
                return { liked: true };
            }
            catch (error) {
                if (error.code === "ER_DUP_ENTRY") {
                    throw new common_1.ConflictException("이미 좋아요한 댓글입니다.");
                }
                throw error;
            }
        }
    }
    async countNovelLikes(novelId) {
        return await this.entityManager.count(like_entity_1.Like, {
            where: { novel: { id: novelId } },
        });
    }
    async countCommentLikes(commentId) {
        return await this.entityManager.count(like_entity_1.Like, {
            where: { comment: { id: commentId } },
        });
    }
    async findLikedNovels(userId) {
        const likes = await this.entityManager.find(like_entity_1.Like, {
            where: {
                user: { id: userId },
                novel: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
            },
            relations: ["novel"],
        });
        const novels = likes.map((like) => like.novel).filter(Boolean);
        return await Promise.all(novels.map(async (novel) => {
            const likeCount = await this.countNovelLikes(novel.id);
            return {
                id: novel.id,
                title: novel.title,
                genre: novel.genre,
                imageUrl: novel.imageUrl,
                views: novel.views,
                created_at: novel.created_at,
                likes: likeCount,
            };
        }));
    }
    async findUserById(userId) {
        const user = await this.entityManager.findOne(user_entity_1.User, {
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("유저를 찾을 수 없습니다.");
        }
        return user;
    }
    async findNovelById(novelId) {
        const novel = await this.entityManager.findOne(novel_entity_1.Novel, {
            where: { id: novelId },
        });
        if (!novel) {
            throw new common_1.NotFoundException("소설을 찾을 수 없습니다.");
        }
        return novel;
    }
    async findCommentById(commentId) {
        const comment = await this.entityManager.findOne(comment_entity_1.Comment, {
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException("댓글을 찾을 수 없습니다.");
        }
        return comment;
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.EntityManager])
], LikeService);
//# sourceMappingURL=like.service.js.map