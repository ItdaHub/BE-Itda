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
exports.NovelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const novel_entity_1 = require("./entities/novel.entity");
const genre_entity_1 = require("../genre/entities/genre.entity");
const user_entity_1 = require("../users/entities/user.entity");
const chapter_entity_1 = require("../chapter/entities/chapter.entity");
const participant_entity_1 = require("./entities/participant.entity");
const novel_entity_2 = require("./entities/novel.entity");
const notification_service_1 = require("../notifications/notification.service");
const ai_service_1 = require("../ai/ai.service");
const tag_entity_1 = require("./entities/tag.entity");
let NovelService = class NovelService {
    novelRepository;
    genreRepository;
    userRepository;
    chapterRepository;
    participantRepository;
    notificationService;
    tagRepository;
    aiService;
    constructor(novelRepository, genreRepository, userRepository, chapterRepository, participantRepository, notificationService, tagRepository, aiService) {
        this.novelRepository = novelRepository;
        this.genreRepository = genreRepository;
        this.userRepository = userRepository;
        this.chapterRepository = chapterRepository;
        this.participantRepository = participantRepository;
        this.notificationService = notificationService;
        this.tagRepository = tagRepository;
        this.aiService = aiService;
    }
    async getAllNovels() {
        return this.novelRepository.find({
            relations: ["genre", "creator", "chapters"],
        });
    }
    async getPublishedNovels() {
        return this.novelRepository.find({
            where: { isPublished: true },
            relations: ["genre", "creator", "chapters"],
        });
    }
    async getNovelById(id) {
        const novel = await this.novelRepository.findOne({
            where: { id },
            relations: ["chapters", "creator", "genre"],
        });
        if (!novel)
            throw new common_1.NotFoundException("해당 소설이 존재하지 않습니다.");
        const nextChapterNumber = novel.chapters.length + 1;
        return {
            ...novel,
            nextChapterNumber,
        };
    }
    async create(dto) {
        const { content, categoryId, peopleNum, userId, type, title, tags } = dto;
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException("작성자 유저를 찾을 수 없습니다.");
        const genre = await this.genreRepository.findOneBy({ id: categoryId });
        if (!genre)
            throw new common_1.NotFoundException("해당 장르가 존재하지 않습니다.");
        let tagEntities = [];
        if (tags && tags.length > 0) {
            tagEntities = await Promise.all(tags.map(async (tagName) => {
                const existing = await this.tagRepository.findOne({
                    where: { name: tagName },
                });
                if (existing)
                    return existing;
                return this.tagRepository.save(this.tagRepository.create({ name: tagName }));
            }));
        }
        const summary = await this.aiService.summarizeText(content);
        const imageUrl = await this.aiService["getImageFromUnsplash"](summary);
        const novel = this.novelRepository.create({
            title,
            creator: user,
            genre,
            max_participants: peopleNum,
            status: novel_entity_2.NovelStatus.ONGOING,
            type,
            imageUrl,
            tags: tagEntities,
        });
        await this.novelRepository.save(novel);
        const chapter = this.chapterRepository.create({
            novel,
            author: user,
            content,
            chapter_number: 1,
        });
        await this.chapterRepository.save(chapter);
        const participant = this.participantRepository.create({
            novel,
            user,
            order_number: 1,
        });
        await this.participantRepository.save(participant);
        return novel;
    }
    async addChapter(novelId, dto) {
        const { userId, content } = dto;
        const novel = await this.novelRepository.findOne({
            where: { id: novelId },
        });
        if (!novel)
            throw new common_1.NotFoundException("해당 소설이 존재하지 않습니다.");
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException("작성자를 찾을 수 없습니다.");
        const existingChapters = await this.chapterRepository.find({
            where: { novel: { id: novelId } },
            order: { chapter_number: "ASC" },
            relations: ["author"],
        });
        const hasWritten = existingChapters.some((chapter) => chapter.author.id === userId);
        if (hasWritten) {
            throw new common_1.BadRequestException("해당 사용자는 이미 이 소설에 작성한 적이 있습니다.");
        }
        const lastChapter = existingChapters[existingChapters.length - 1];
        if (lastChapter?.author?.id === userId) {
            throw new common_1.BadRequestException("연속으로 작성할 수 없습니다.");
        }
        const participantCount = await this.participantRepository.count({
            where: { novel: { id: novelId } },
        });
        if (participantCount >= novel.max_participants) {
            throw new common_1.BadRequestException("참여자 수를 초과했습니다.");
        }
        const participant = this.participantRepository.create({
            novel,
            user,
            order_number: participantCount + 1,
        });
        await this.participantRepository.save(participant);
        const chapterNumber = existingChapters.length > 0 ? existingChapters.length + 1 : 1;
        const chapter = this.chapterRepository.create({
            novel,
            author: user,
            content,
            chapter_number: chapterNumber,
        });
        const savedChapter = await this.chapterRepository.save(chapter);
        const newParticipantCount = await this.participantRepository.count({
            where: { novel: { id: novelId } },
        });
        await this.checkAndUpdateNovelStatus(novelId);
        return {
            chapter: savedChapter,
            peopleNum: novel.max_participants,
            currentPeople: newParticipantCount,
            status: novel.status,
        };
    }
    async checkAndUpdateNovelStatus(novelId) {
        const novel = await this.novelRepository.findOne({
            where: { id: novelId },
            relations: ["chapters"],
        });
        if (!novel) {
            throw new common_1.NotFoundException(`Novel with ID ${novelId} not found`);
        }
        const chapterCount = novel.chapters.length;
        if (chapterCount >= novel.max_participants &&
            novel.status !== novel_entity_2.NovelStatus.COMPLETED) {
            novel.status = novel_entity_2.NovelStatus.COMPLETED;
            await this.novelRepository.save(novel);
        }
    }
    async getChapters(novelId, userId) {
        const novel = await this.novelRepository.findOne({
            select: ["id", "status"],
        });
        const chapters = await this.chapterRepository.find({
            where: { novel: { id: novelId } },
            order: { chapter_number: "ASC" },
            relations: ["author"],
        });
        const isFree = novel?.status !== novel_entity_2.NovelStatus.SUBMITTED;
        return chapters.map((chapter) => ({
            id: chapter.id,
            chapterNumber: chapter.chapter_number,
            content: isFree ? chapter.content : null,
            createdAt: chapter.created_at,
            authorId: chapter.author?.id,
            authorNickname: chapter.author?.nickname ?? null,
        }));
    }
    async getParticipants(novelId) {
        return this.participantRepository.find({
            where: { novel: { id: novelId } },
            relations: ["user"],
            order: { order_number: "ASC" },
        });
    }
    async getFilteredNovels(type, genre, age) {
        const query = this.novelRepository
            .createQueryBuilder("novel")
            .leftJoinAndSelect("novel.creator", "user")
            .leftJoinAndSelect("novel.genre", "genre")
            .leftJoinAndSelect("novel.likes", "likes")
            .loadRelationCountAndMap("novel.likeCount", "novel.likes")
            .where("novel.status != :submitted", {
            submitted: novel_entity_2.NovelStatus.SUBMITTED,
        });
        if (type === "new") {
            query
                .leftJoin("novel.chapters", "chapter_new")
                .andWhere("chapter_new.chapter_number = 1");
        }
        else if (type === "relay") {
            query.andWhere("novel.type = :type", { type });
        }
        if (typeof genre === "string" && genre !== "all" && genre !== "전체") {
            const foundGenre = await this.genreRepository.findOne({
                where: { value: genre },
            });
            if (foundGenre) {
                query.andWhere("genre.id = :genreId", { genreId: foundGenre.id });
            }
            else {
                throw new common_1.NotFoundException(`장르 '${genre}'를 찾을 수 없습니다.`);
            }
        }
        else if (!isNaN(Number(genre))) {
            const genreId = Number(genre);
            query.andWhere("genre.id = :genreId", { genreId });
        }
        if (age !== undefined) {
            query.andWhere("user.age_group = :age", { age });
        }
        const results = await query.orderBy("novel.created_at", "DESC").getMany();
        return results.map((novel) => ({
            id: novel.id,
            title: novel.title,
            genre: novel.genre?.name ?? null,
            imageUrl: novel.imageUrl,
            likes: novel.likeCount ?? novel.likes?.length ?? 0,
            views: novel.viewCount ?? 0,
            created_at: novel.created_at,
        }));
    }
    async getNovelDetail(novelId, userId) {
        const novel = await this.novelRepository.findOne({
            where: { id: novelId },
            relations: [
                "creator",
                "genre",
                "likes",
                "likes.user",
                "participants",
                "participants.user",
                "chapters",
                "chapters.author",
                "chapters.reports",
                "tags",
            ],
        });
        if (!novel)
            throw new common_1.NotFoundException("소설을 찾을 수 없습니다.");
        novel.viewCount += 1;
        await this.novelRepository.save(novel);
        const likeCount = novel.likes.length;
        const isLiked = userId
            ? novel.likes.some((like) => like.user.id === userId)
            : false;
        const sortedChapters = novel.chapters.sort((a, b) => a.chapter_number - b.chapter_number);
        const freeCount = Math.floor(sortedChapters.length / 3);
        sortedChapters.forEach((chapter, index) => {
            chapter.isPaid = index >= freeCount;
            console.log(`Chapter ${chapter.chapter_number} → isPaid: ${chapter.isPaid}`);
        });
        return {
            id: novel.id,
            title: novel.title,
            genre: novel.genre?.name ?? null,
            categoryId: novel.genre?.id ?? null,
            author: novel.participants
                .filter((p) => p.user?.nickname)
                .map((p) => p.user.nickname)
                .join(", "),
            likeCount,
            isLiked,
            image: novel.imageUrl,
            type: novel.type,
            createdAt: novel.created_at.toISOString(),
            peopleNum: novel.max_participants,
            tags: novel.tags?.map((tag) => tag.name) ?? [],
            chapters: sortedChapters.map((chapter) => ({
                id: chapter.id,
                content: chapter.content,
                chapterNumber: chapter.chapter_number,
                authorId: chapter.author?.id,
                authorNickname: chapter.author?.nickname ?? null,
                reportCount: chapter.reports?.length ?? 0,
                isPaid: chapter.isPaid,
            })),
            nextChapterNumber: sortedChapters.length + 1,
            status: novel.status,
        };
    }
    async findMyNovels(userId) {
        const chapters = await this.chapterRepository.find({
            where: { author: { id: userId } },
            relations: ["novel", "novel.creator", "novel.genre"],
        });
        const novelsMap = new Map();
        for (const chapter of chapters) {
            const novel = chapter.novel;
            if (novel.status === "ongoing" || novel.status === "submitted") {
                novelsMap.set(novel.id, novel);
            }
        }
        return Array.from(novelsMap.values()).sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    }
    async searchNovelsByTitle(query) {
        return this.novelRepository.find({
            where: { title: (0, typeorm_1.Like)(`%${query}%`) },
            relations: ["genre", "creator", "chapters"],
            order: { created_at: "DESC" },
        });
    }
    async getRankedNovels() {
        const novels = await this.novelRepository.find({
            relations: ["likes", "creator", "genre", "chapters"],
        });
        return novels
            .map((novel) => ({
            ...novel,
            score: (novel.likes?.length || 0) * 0.7 + (novel.viewCount || 0) * 0.3,
        }))
            .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
            .slice(0, 10);
    }
    async getRankedNovelsByAge(ageGroup) {
        const novels = await this.novelRepository.find({
            where: { creator: { age_group: ageGroup } },
            relations: ["likes", "creator", "genre", "chapters"],
        });
        return novels
            .map((novel) => ({
            ...novel,
            score: (novel.likes?.length || 0) * 0.7 + (novel.viewCount || 0) * 0.3,
        }))
            .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
            .slice(0, 10);
    }
    async submitNovelForCompletion(novelId) {
        console.log("소설 완료 요청 ID:", novelId);
        const novel = await this.novelRepository.findOneBy({ id: novelId });
        if (!novel) {
            throw new common_1.NotFoundException(`소설 ID ${novelId}를 찾을 수 없습니다.`);
        }
        if (novel.status === novel_entity_2.NovelStatus.COMPLETED ||
            novel.status === novel_entity_2.NovelStatus.SUBMITTED) {
            return novel;
        }
        novel.status = novel_entity_2.NovelStatus.COMPLETED;
        console.log("소설 상태를 COMPLETED로 변경");
        return await this.novelRepository.save(novel);
    }
    async getCompletedNovels() {
        const novels = await this.novelRepository.find({
            where: { status: (0, typeorm_1.In)(["submitted", "completed"]) },
            relations: ["creator"],
            order: { created_at: "DESC" },
        });
        return novels.map((novel) => ({
            id: novel.id,
            title: novel.title,
            writer: novel.creator?.name || "알 수 없음",
            date: novel.created_at.toISOString().split("T")[0],
            status: novel.status,
        }));
    }
    async adminDeleteNovel(novelId) {
        const novel = await this.novelRepository.findOne({
            where: { id: novelId },
        });
        if (!novel)
            throw new common_1.NotFoundException("소설을 찾을 수 없습니다.");
        return this.novelRepository.remove(novel);
    }
    async adminPublishNovel(novelId) {
        const novel = await this.novelRepository.findOne({
            where: { id: novelId },
            relations: ["creator", "chapters", "chapters.author"],
        });
        if (!novel)
            throw new common_1.NotFoundException("소설을 찾을 수 없습니다.");
        novel.status = novel_entity_2.NovelStatus.SUBMITTED;
        novel.isPublished = true;
        await this.novelRepository.save(novel);
        const chapters = novel.chapters.sort((a, b) => Number(a.chapter_number) - Number(b.chapter_number));
        const total = chapters.length;
        const freeLimit = Math.floor(total / 3);
        for (let i = 0; i < total; i++) {
            chapters[i].isPaid = i >= freeLimit;
        }
        await this.chapterRepository.save(chapters);
        const participantMap = new Map();
        for (const chapter of chapters) {
            if (chapter.author && !participantMap.has(chapter.author.id)) {
                participantMap.set(chapter.author.id, chapter.author);
            }
        }
        for (const user of participantMap.values()) {
            await this.notificationService.sendNotification({
                user,
                content: `당신이 참여한 소설 "${novel.title}"이 출품되었습니다!`,
                novel,
                type: "NOVEL_SUBMIT",
            });
        }
        console.log("✅ 출품 완료 및 알림 전송 완료:", novel.title);
        return novel;
    }
    async getWaitingNovelsForSubmission() {
        const novels = await this.novelRepository.find({
            where: { status: novel_entity_2.NovelStatus.COMPLETED },
            relations: ["creator"],
            order: { created_at: "DESC" },
        });
        return novels.map((novel) => ({
            id: novel.id,
            title: novel.title,
            writer: novel.creator?.name || "알 수 없음",
            date: novel.created_at.toISOString().split("T")[0],
            status: novel.status,
        }));
    }
};
exports.NovelService = NovelService;
exports.NovelService = NovelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(novel_entity_1.Novel)),
    __param(1, (0, typeorm_2.InjectRepository)(genre_entity_1.Genre)),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_2.InjectRepository)(chapter_entity_1.Chapter)),
    __param(4, (0, typeorm_2.InjectRepository)(participant_entity_1.Participant)),
    __param(6, (0, typeorm_2.InjectRepository)(tag_entity_1.Tag)),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => ai_service_1.AiService))),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        notification_service_1.NotificationService,
        typeorm_3.Repository,
        ai_service_1.AiService])
], NovelService);
//# sourceMappingURL=novel.service.js.map