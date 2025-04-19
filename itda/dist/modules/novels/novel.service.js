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
const novel_entity_1 = require("./novel.entity");
const genre_entity_1 = require("../genre/genre.entity");
const user_entity_1 = require("../users/user.entity");
const chapter_entity_1 = require("../chapter/chapter.entity");
const participant_entity_1 = require("./participant.entity");
const novel_entity_2 = require("./novel.entity");
const notification_service_1 = require("../notifications/notification.service");
let NovelService = class NovelService {
    novelRepo;
    genreRepo;
    userRepo;
    chapterRepo;
    participantRepo;
    notificationService;
    constructor(novelRepo, genreRepo, userRepo, chapterRepo, participantRepo, notificationService) {
        this.novelRepo = novelRepo;
        this.genreRepo = genreRepo;
        this.userRepo = userRepo;
        this.chapterRepo = chapterRepo;
        this.participantRepo = participantRepo;
        this.notificationService = notificationService;
    }
    async getAllNovels() {
        return this.novelRepo.find({ relations: ["genre", "creator", "chapters"] });
    }
    async getPublishedNovels() {
        return this.novelRepo.find({
            where: { isPublished: true },
            relations: ["genre", "creator", "chapters"],
        });
    }
    async getNovelById(id) {
        const novel = await this.novelRepo.findOne({
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
        const { title, categoryId, peopleNum, content, userId, type } = dto;
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException("작성자 유저를 찾을 수 없습니다.");
        const genre = await this.genreRepo.findOneBy({ id: categoryId });
        if (!genre)
            throw new common_1.NotFoundException("해당 장르가 존재하지 않습니다.");
        const novel = this.novelRepo.create({
            title,
            creator: user,
            genre,
            max_participants: peopleNum,
            status: novel_entity_2.NovelStatus.ONGOING,
            type,
        });
        await this.novelRepo.save(novel);
        const chapter = this.chapterRepo.create({
            novel,
            author: user,
            content,
            chapter_number: 1,
        });
        await this.chapterRepo.save(chapter);
        const participant = this.participantRepo.create({
            novel,
            user,
            order_number: 1,
        });
        await this.participantRepo.save(participant);
        return novel;
    }
    async addChapter(novelId, dto) {
        const { userId, content } = dto;
        const novel = await this.novelRepo.findOne({ where: { id: novelId } });
        if (!novel)
            throw new common_1.NotFoundException("해당 소설이 존재하지 않습니다.");
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException("작성자를 찾을 수 없습니다.");
        const existingChapters = await this.chapterRepo.find({
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
        const participantCount = await this.participantRepo.count({
            where: { novel: { id: novelId } },
        });
        if (participantCount >= novel.max_participants) {
            throw new common_1.BadRequestException("참여자 수를 초과했습니다.");
        }
        const participant = this.participantRepo.create({
            novel,
            user,
            order_number: participantCount + 1,
        });
        await this.participantRepo.save(participant);
        const chapterNumber = existingChapters.length > 0 ? existingChapters.length + 1 : 1;
        const chapter = this.chapterRepo.create({
            novel,
            author: user,
            content,
            chapter_number: chapterNumber,
        });
        const savedChapter = await this.chapterRepo.save(chapter);
        const newParticipantCount = await this.participantRepo.count({
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
        const novel = await this.novelRepo.findOne({
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
            await this.novelRepo.save(novel);
        }
    }
    async getChapters(novelId) {
        const chapters = await this.chapterRepo.find({
            where: { novel: { id: novelId } },
            order: { chapter_number: "ASC" },
            relations: ["author"],
        });
        return chapters.map((chapter) => ({
            id: chapter.id,
            chapterNumber: chapter.chapter_number,
            content: chapter.content,
            createdAt: chapter.created_at,
            authorId: chapter.author?.id,
            authorNickname: chapter.author?.nickname ?? null,
        }));
    }
    async getParticipants(novelId) {
        return this.participantRepo.find({
            where: { novel: { id: novelId } },
            relations: ["user"],
            order: { order_number: "ASC" },
        });
    }
    async getFilteredNovels(type, genre, age) {
        const query = this.novelRepo
            .createQueryBuilder("novel")
            .leftJoinAndSelect("novel.creator", "user")
            .leftJoinAndSelect("novel.genre", "genre")
            .leftJoinAndSelect("novel.likes", "likes")
            .loadRelationCountAndMap("novel.likeCount", "novel.likes");
        if (type === "new") {
            query
                .leftJoin("novel.chapters", "chapter_new")
                .andWhere("chapter_new.chapter_number = 1");
        }
        else if (type === "relay") {
            query.andWhere("novel.type = :type", { type });
        }
        if (typeof genre === "string" && genre !== "all" && genre !== "전체") {
            const foundGenre = await this.genreRepo.findOne({
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
            imageUrl: novel.cover_image,
            likes: novel.likeCount ?? novel.likes?.length ?? 0,
            views: novel.viewCount ?? 0,
            created_at: novel.created_at,
        }));
    }
    async getNovelDetail(novelId, userId) {
        const novel = await this.novelRepo.findOne({
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
            ],
        });
        if (!novel)
            throw new common_1.NotFoundException("소설을 찾을 수 없습니다.");
        novel.viewCount += 1;
        await this.novelRepo.save(novel);
        const likeCount = novel.likes.length;
        const isLiked = userId
            ? novel.likes.some((like) => like.user.id === userId)
            : false;
        const sortedChapters = [...novel.chapters].sort((a, b) => a.chapter_number - b.chapter_number);
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
            image: novel.cover_image,
            type: novel.type,
            createdAt: novel.created_at.toISOString(),
            peopleNum: novel.max_participants,
            chapters: novel.chapters
                .sort((a, b) => a.chapter_number - b.chapter_number)
                .map((chapter) => ({
                id: chapter.id,
                content: chapter.content,
                chapterNumber: chapter.chapter_number,
                authorId: chapter.author?.id,
                authorNickname: chapter.author?.nickname ?? null,
                reportCount: chapter.reports?.length ?? 0,
            })),
            nextChapterNumber: sortedChapters.length + 1,
        };
    }
    async findMyNovels(userId) {
        return this.novelRepo.find({
            where: { creator: { id: userId } },
            relations: ["creator"],
            order: { created_at: "DESC" },
        });
    }
    async searchNovelsByTitle(query) {
        return this.novelRepo.find({
            where: { title: (0, typeorm_1.Like)(`%${query}%`) },
            relations: ["genre", "creator", "chapters"],
            order: { created_at: "DESC" },
        });
    }
    async getRankedNovels() {
        const novels = await this.novelRepo.find({
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
        const novels = await this.novelRepo.find({
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
        console.log("출품 요청된 소설 ID:", novelId);
        const novel = await this.novelRepo.findOneBy({ id: novelId });
        console.log("조회된 소설:", novel);
        if (!novel) {
            throw new common_1.NotFoundException(`소설 ID ${novelId}를 찾을 수 없습니다.`);
        }
        if (novel.status !== "completed") {
            throw new common_1.BadRequestException("완료된 소설만 출품할 수 있습니다.");
        }
        novel.status = novel_entity_2.NovelStatus.SUBMITTED;
        console.log("소설 상태를 SUBMITTED로 변경");
        const writer = novel.creator;
        if (writer) {
            await this.notificationService.sendNotification({
                user: writer,
                content: `🎉 "${novel.title}" 소설이 출품되었습니다!`,
                novel,
            });
        }
        return await this.novelRepo.save(novel);
    }
    async getCompletedNovels() {
        const novels = await this.novelRepo.find({
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
        const novel = await this.novelRepo.findOne({ where: { id: novelId } });
        if (!novel)
            throw new common_1.NotFoundException("소설을 찾을 수 없습니다.");
        return this.novelRepo.remove(novel);
    }
    async adminPublishNovel(novelId) {
        const novel = await this.novelRepo.findOne({ where: { id: novelId } });
        if (!novel)
            throw new common_1.NotFoundException("소설을 찾을 수 없습니다.");
        novel.isPublished = true;
        return this.novelRepo.save(novel);
    }
    async getWaitingNovelsForSubmission() {
        const novels = await this.novelRepo.find({
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
    __metadata("design:paramtypes", [typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        notification_service_1.NotificationService])
], NovelService);
//# sourceMappingURL=novel.service.js.map