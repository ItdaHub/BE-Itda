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
exports.ChapterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chapter_entity_1 = require("./chapter.entity");
const novel_entity_1 = require("../novels/novel.entity");
const ai_service_1 = require("../ai/ai.service");
let ChapterService = class ChapterService {
    chapterRepository;
    novelRepository;
    aiService;
    constructor(chapterRepository, novelRepository, aiService) {
        this.chapterRepository = chapterRepository;
        this.novelRepository = novelRepository;
        this.aiService = aiService;
    }
    async getChaptersByNovel(novelId) {
        const novel = await this.novelRepository.findOne({
            where: { id: novelId },
        });
        if (!novel) {
            throw new common_1.NotFoundException(`Novel with ID ${novelId} not found`);
        }
        const chapters = await this.chapterRepository.find({
            where: { novel: { id: novelId } },
            order: { chapter_number: "ASC" },
            relations: ["comments", "author"],
        });
        return chapters.map((chapter) => ({
            id: chapter.id,
            chapter_number: chapter.chapter_number,
            content: chapter.content,
            created_at: chapter.created_at,
            nickname: chapter.author?.nickname || "알 수 없음",
            comments: chapter.comments,
            isPublished: novel.isPublished,
        }));
    }
    async getChapterContent(novelId, chapterId) {
        const novel = await this.novelRepository.findOne({
            where: { id: novelId },
        });
        if (!novel) {
            throw new common_1.NotFoundException(`Novel with ID ${novelId} not found`);
        }
        const chapter = await this.chapterRepository.findOne({
            where: { id: chapterId, novel: { id: novelId } },
            relations: ["author"],
        });
        if (!chapter) {
            throw new common_1.NotFoundException(`Chapter with ID ${chapterId} not found`);
        }
        const totalChapters = await this.chapterRepository.count({
            where: { novel: { id: novelId } },
        });
        const isLastChapter = chapter.chapter_number === totalChapters;
        const slides = chapter.content
            .split(/\n{2,}/)
            .map((text, index) => ({
            index,
            text: text.trim(),
        }))
            .filter((slide) => slide.text.length > 0);
        return {
            slides,
            authorNickname: chapter.author?.nickname || "알 수 없음",
            writerId: chapter.author?.id,
            chapterNumber: chapter.chapter_number,
            isLastChapter,
            isPublished: novel.isPublished,
        };
    }
    async createChapter(novelId, content, user, chapterNumber) {
        const novel = await this.novelRepository.findOne({
            where: { id: novelId },
            relations: ["chapters", "genre"],
        });
        if (!novel) {
            throw new common_1.NotFoundException(`Novel with ID ${novelId} not found`);
        }
        if (!user || !user.id) {
            throw new Error("유저 정보가 잘못되었습니다.");
        }
        const alreadyWrote = await this.chapterRepository.findOne({
            where: {
                novel: { id: novelId },
                author: { id: user.id },
            },
        });
        if (alreadyWrote) {
            throw new Error("이미 이 소설에 이어쓴 기록이 있습니다.");
        }
        let newChapterNumber;
        if (chapterNumber) {
            newChapterNumber = chapterNumber;
        }
        else {
            const chapterCount = await this.chapterRepository.count({
                where: { novel: { id: novelId } },
            });
            newChapterNumber = chapterCount + 1;
        }
        if (newChapterNumber === 1) {
            const { summary, imageUrl } = await this.aiService.createNovelWithAi(content, user.id, novel.genre.id, novel.max_participants, novel.type);
            novel.cover_image = imageUrl;
            await this.novelRepository.save(novel);
        }
        const newChapter = this.chapterRepository.create({
            content,
            chapter_number: newChapterNumber,
            novel,
            author: user,
        });
        await this.chapterRepository.save(newChapter);
        console.log("Calling updatePaidStatus for novelId:", novelId);
        await this.updatePaidStatus(novelId);
        return newChapter;
    }
    async hasUserParticipatedInNovel(novelId, userId) {
        const alreadyParticipated = await this.chapterRepository.findOne({
            where: {
                novel: { id: novelId },
                author: { id: userId },
            },
        });
        return !!alreadyParticipated;
    }
    async checkIsPaid(novelId, chapterId) {
        const chapter = await this.chapterRepository.findOne({
            where: {
                id: chapterId,
                novel: { id: novelId },
            },
        });
        if (!chapter) {
            throw new common_1.NotFoundException("해당 챕터를 찾을 수 없습니다.");
        }
        return chapter.isPaid ?? false;
    }
    async updatePaidStatus(novelId) {
        console.log("Executing updatePaidStatus for novelId:", novelId);
        const chapters = await this.chapterRepository.find({
            where: { novel: { id: novelId } },
            order: { chapter_number: "ASC" },
        });
        if (!chapters || chapters.length === 0) {
            console.log("No chapters found for novelId:", novelId);
            return;
        }
        console.log("Found chapters:", chapters);
        const totalChapters = chapters.length;
        const paidCount = Math.floor(totalChapters * (2 / 3));
        const paidStartIndex = totalChapters - paidCount;
        console.log(`Paid chapters start from index: ${paidStartIndex}`);
        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            const isPaid = i >= paidStartIndex;
            if (chapter.isPaid !== isPaid) {
                chapter.isPaid = isPaid;
                await this.chapterRepository.save(chapter);
                console.log(`✅ Chapter ${chapter.chapter_number} is set to ${isPaid ? "paid" : "free"}`);
            }
        }
    }
};
exports.ChapterService = ChapterService;
exports.ChapterService = ChapterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chapter_entity_1.Chapter)),
    __param(1, (0, typeorm_1.InjectRepository)(novel_entity_1.Novel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        ai_service_1.AiService])
], ChapterService);
//# sourceMappingURL=chapter.service.js.map