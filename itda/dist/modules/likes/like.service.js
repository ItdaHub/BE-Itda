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
const typeorm_2 = require("typeorm");
const like_entity_1 = require("./like.entity");
const user_entity_1 = require("../users/user.entity");
const novel_entity_1 = require("../novels/novel.entity");
const comment_entity_1 = require("../comments/comment.entity");
let LikeService = class LikeService {
    entityManager;
    constructor(entityManager) {
        this.entityManager = entityManager;
    }
    async likeNovel(userId, novelId) {
        const user = await this.findUserById(userId);
        const novel = await this.findNovelById(novelId);
        const existingLike = await this.entityManager.findOne(like_entity_1.Like, {
            where: { user, novel },
        });
        if (existingLike) {
            throw new common_1.NotFoundException("You already liked this novel");
        }
        const like = this.entityManager.create(like_entity_1.Like, {
            user,
            novel,
            target_type: "novel",
        });
        return await this.entityManager.save(like);
    }
    async unlikeNovel(userId, novelId) {
        const user = await this.findUserById(userId);
        const result = await this.entityManager.delete(like_entity_1.Like, {
            user,
            novel: { id: novelId },
        });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Like not found for novel ID ${novelId}`);
        }
    }
    async toggleNovelLike(userId, novelId) {
        const user = await this.findUserById(userId);
        const novel = await this.findNovelById(novelId);
        const existingLike = await this.entityManager.findOne(like_entity_1.Like, {
            where: { user, novel },
        });
        if (existingLike) {
            await this.entityManager.remove(existingLike);
            return { liked: false };
        }
        else {
            const like = this.entityManager.create(like_entity_1.Like, {
                user,
                novel,
                target_type: "novel",
            });
            await this.entityManager.save(like);
            return { liked: true };
        }
    }
    async likeComment(userId, commentId) {
        const user = await this.findUserById(userId);
        const comment = await this.findCommentById(commentId);
        const existingLike = await this.entityManager.findOne(like_entity_1.Like, {
            where: { user, comment },
        });
        if (existingLike) {
            throw new common_1.NotFoundException("You already liked this comment");
        }
        const like = this.entityManager.create(like_entity_1.Like, {
            user,
            comment,
            target_type: "comment",
        });
        return await this.entityManager.save(like);
    }
    async unlikeComment(userId, commentId) {
        const user = await this.findUserById(userId);
        const result = await this.entityManager.delete(like_entity_1.Like, {
            user,
            comment: { id: commentId },
        });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Like not found for comment ID ${commentId}`);
        }
    }
    async toggleCommentLike(userId, commentId) {
        const user = await this.findUserById(userId);
        const comment = await this.findCommentById(commentId);
        const existingLike = await this.entityManager.findOne(like_entity_1.Like, {
            where: { user, comment },
        });
        if (existingLike) {
            await this.entityManager.remove(existingLike);
            return { liked: false };
        }
        else {
            const like = this.entityManager.create(like_entity_1.Like, {
                user,
                comment,
                target_type: "comment",
            });
            await this.entityManager.save(like);
            return { liked: true };
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
    async getLikedNovels(userId) {
        const likes = await this.entityManager.find(like_entity_1.Like, {
            where: { user: { id: userId }, target_type: "novel" },
            relations: ["novel"],
        });
        return likes.map((like) => like.novel).filter(Boolean);
    }
    async findUserById(userId) {
        const user = await this.entityManager.findOne(user_entity_1.User, {
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
    async findNovelById(novelId) {
        const novel = await this.entityManager.findOne(novel_entity_1.Novel, {
            where: { id: novelId },
        });
        if (!novel) {
            throw new common_1.NotFoundException(`Novel with ID ${novelId} not found`);
        }
        return novel;
    }
    async findCommentById(commentId) {
        const comment = await this.entityManager.findOne(comment_entity_1.Comment, {
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${commentId} not found`);
        }
        return comment;
    }
    async findLikedNovels(userId) {
        const likes = await this.entityManager.find(like_entity_1.Like, {
            where: {
                user: { id: userId },
                novel: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
            },
            relations: ["novel"],
        });
        return likes.map((like) => like.novel).filter(Boolean);
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_2.EntityManager])
], LikeService);
//# sourceMappingURL=like.service.js.map