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
exports.RecentNovelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const recentNovel_entity_1 = require("./entities/recentNovel.entity");
const typeorm_2 = require("typeorm");
const novel_entity_1 = require("./entities/novel.entity");
let RecentNovelService = class RecentNovelService {
    recentNovelRepository;
    novelRepo;
    constructor(recentNovelRepository, novelRepo) {
        this.recentNovelRepository = recentNovelRepository;
        this.novelRepo = novelRepo;
    }
    async addRecentNovel(user, novelId, chapterNumber) {
        const novel = await this.novelRepo.findOneByOrFail({ id: novelId });
        await this.recentNovelRepository.upsert({
            user: { id: user.id },
            novel: { id: novel.id },
            chapterNumber,
            viewedAt: new Date(),
        }, ["userId", "novelId", "chapterNumber"]);
    }
    async getRecentNovels(user, limit = 20) {
        const recentList = await this.recentNovelRepository.find({
            where: { user: { id: user.id } },
            order: { viewedAt: "DESC" },
            take: limit,
            relations: ["user", "novel"],
        });
        console.log("recentList:", recentList);
        return recentList;
    }
};
exports.RecentNovelService = RecentNovelService;
exports.RecentNovelService = RecentNovelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(recentNovel_entity_1.RecentNovel)),
    __param(1, (0, typeorm_1.InjectRepository)(novel_entity_1.Novel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RecentNovelService);
//# sourceMappingURL=recentNovel.service.js.map