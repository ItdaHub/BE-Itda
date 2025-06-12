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
exports.PointService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const point_entity_1 = require("./entities/point.entity");
const user_entity_1 = require("../users/entities/user.entity");
const purchases_entity_1 = require("./entities/purchases.entity");
const novel_entity_1 = require("../novels/entities/novel.entity");
const novel_entity_2 = require("../novels/entities/novel.entity");
let PointService = class PointService {
    pointRepository;
    purchaseRepository;
    userRepository;
    novelRepository;
    constructor(pointRepository, purchaseRepository, userRepository, novelRepository) {
        this.pointRepository = pointRepository;
        this.purchaseRepository = purchaseRepository;
        this.userRepository = userRepository;
        this.novelRepository = novelRepository;
    }
    async getUserTotalPoints(userId) {
        const result = await this.pointRepository
            .createQueryBuilder("point")
            .select("SUM(point.amount)", "total")
            .where("point.user.id = :userId", { userId })
            .getRawOne();
        return Number(result.total) || 0;
    }
    async spendPoints(usePopcornDto) {
        const { userId, novelId, chapterId, amount, description } = usePopcornDto;
        console.log("🎯 spendPoints 실행됨:", usePopcornDto);
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("유저를 찾을 수 없습니다");
        }
        if (novelId && chapterId) {
            const novel = await this.novelRepository.findOne({
                where: { id: novelId },
                relations: ["chapters"],
            });
            if (!novel) {
                throw new common_1.NotFoundException("소설을 찾을 수 없습니다");
            }
            console.log("🔍 novel.status:", novel.status);
            console.log("🆚 expected status:", novel_entity_2.NovelStatus.SUBMITTED);
            if (novel.status !== novel_entity_2.NovelStatus.SUBMITTED) {
                throw new common_1.BadRequestException("출품되지 않은 소설은 결제할 수 없습니다");
            }
            const totalChapters = novel.max_participants;
            const freeChapters = Math.floor(totalChapters / 3);
            if (chapterId <= freeChapters) {
                throw new common_1.BadRequestException(`${freeChapters}회차까지는 무료입니다`);
            }
        }
        await this.pointRepository.save({
            user,
            amount: -amount,
            type: point_entity_1.PointType.SPEND,
            description,
        });
        if (novelId && chapterId) {
            const existing = await this.purchaseRepository.findOne({
                where: {
                    user: { id: userId },
                    novelId,
                    chapterId,
                },
            });
            if (!existing) {
                await this.purchaseRepository.save({
                    user: { id: userId },
                    novelId,
                    chapterId,
                });
            }
        }
        return { success: true };
    }
    async hasPurchased(userId, novelId, chapterId) {
        const existing = await this.purchaseRepository
            .createQueryBuilder("purchase")
            .where("purchase.userId = :userId", { userId })
            .andWhere("purchase.novelId = :novelId", { novelId })
            .andWhere("purchase.chapterId = :chapterId", { chapterId })
            .getOne();
        return !!existing;
    }
    async addPoint(user, amount, type, description) {
        const point = this.pointRepository.create({
            user,
            amount,
            type,
            description,
        });
        return await this.pointRepository.save(point);
    }
    async getUserHistory(userId, type) {
        const result = await this.pointRepository.find({
            where: {
                user: { id: userId },
                type,
            },
            order: {
                created_at: "DESC",
            },
            select: {
                amount: true,
                created_at: true,
                description: true,
            },
        });
        return result.map((entry) => ({
            title: entry.description ||
                (type === point_entity_1.PointType.EARN ? "팝콘 충전" : "팝콘 사용"),
            amount: entry.amount,
            date: entry.created_at.toISOString().slice(0, 19).replace("T", " "),
        }));
    }
    async getPurchasedChapters(userId, novelId) {
        return this.purchaseRepository.find({
            where: {
                user: { id: userId },
                novelId,
            },
            select: ["chapterId"],
        });
    }
};
exports.PointService = PointService;
exports.PointService = PointService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(point_entity_1.Point)),
    __param(1, (0, typeorm_1.InjectRepository)(purchases_entity_1.Purchase)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(novel_entity_1.Novel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PointService);
//# sourceMappingURL=point.service.js.map