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
const point_entity_1 = require("./point.entity");
const user_entity_1 = require("../users/user.entity");
const purchases_entity_1 = require("./purchases.entity");
let PointService = class PointService {
    pointRepository;
    purchaseRepository;
    userRepository;
    constructor(pointRepository, purchaseRepository, userRepository) {
        this.pointRepository = pointRepository;
        this.purchaseRepository = purchaseRepository;
        this.userRepository = userRepository;
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
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("유저를 찾을 수 없습니다");
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
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PointService);
//# sourceMappingURL=point.service.js.map