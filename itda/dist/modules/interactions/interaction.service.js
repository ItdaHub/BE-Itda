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
exports.InteractionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vote_entity_1 = require("./vote.entity");
const comment_entity_1 = require("./comment.entity");
const novel_entity_1 = require("../novels/novel.entity");
const user_entity_1 = require("../users/user.entity");
const chapter_entity_1 = require("../novels/chapter.entity");
let InteractionsService = class InteractionsService {
    voteRepository;
    commentRepository;
    novelRepository;
    userRepository;
    chapterRepository;
    constructor(voteRepository, commentRepository, novelRepository, userRepository, chapterRepository) {
        this.voteRepository = voteRepository;
        this.commentRepository = commentRepository;
        this.novelRepository = novelRepository;
        this.userRepository = userRepository;
        this.chapterRepository = chapterRepository;
    }
    async createVote({ novelId, userId, result, }) {
        const novel = await this.novelRepository.findOne({
            where: { id: novelId },
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!novel || !user)
            throw new Error("Novel or User not found");
        const vote = this.voteRepository.create({ novel, user, result });
        return this.voteRepository.save(vote);
    }
    async createComment({ novelId, chapterId, userId, content, parentCommentId, }) {
        const novel = await this.novelRepository.findOne({
            where: { id: novelId },
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const chapter = chapterId
            ? await this.chapterRepository.findOne({ where: { id: chapterId } })
            : null;
        const parentComment = parentCommentId
            ? await this.commentRepository.findOne({ where: { id: parentCommentId } })
            : null;
        if (!novel || !user)
            throw new Error("Novel or User not found");
        const comment = this.commentRepository.create({
            novel,
            chapter,
            user,
            content,
            parent_comment: parentComment,
        });
        return this.commentRepository.save(comment);
    }
    async getCommentsByNovel(novelId) {
        return this.commentRepository.find({
            where: { novel: { id: novelId } },
            relations: ["user", "chapter", "parent_comment", "childComments"],
        });
    }
    async deleteComment(commentId) {
        return this.commentRepository.delete(commentId);
    }
};
exports.InteractionsService = InteractionsService;
exports.InteractionsService = InteractionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(2, (0, typeorm_1.InjectRepository)(novel_entity_1.Novel)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(chapter_entity_1.Chapter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InteractionsService);
//# sourceMappingURL=interaction.service.js.map