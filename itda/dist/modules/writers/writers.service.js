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
exports.WritersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chapter_entity_1 = require("../chapter/chapter.entity");
const typeorm_2 = require("typeorm");
let WritersService = class WritersService {
    chapterRepo;
    constructor(chapterRepo) {
        this.chapterRepo = chapterRepo;
    }
    async getNicknameByChapterId(chapterId) {
        const chapter = await this.chapterRepo.findOne({
            where: { id: chapterId },
            relations: ["author"],
        });
        if (!chapter || !chapter.author) {
            throw new common_1.NotFoundException("해당 챕터 또는 작가가 존재하지 않습니다.");
        }
        return chapter.author.nickname;
    }
};
exports.WritersService = WritersService;
exports.WritersService = WritersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chapter_entity_1.Chapter)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WritersService);
//# sourceMappingURL=writers.service.js.map