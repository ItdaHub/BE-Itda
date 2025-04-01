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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const novel_entity_1 = require("./novel.entity");
let NovelService = class NovelService {
    novelRepository;
    constructor(novelRepository) {
        this.novelRepository = novelRepository;
    }
    async getAllNovels() {
        return await this.novelRepository.find({
            relations: [
                "creator",
                "genre",
                "participants",
                "chapters",
                "aiGeneratedImages",
            ],
        });
    }
    async getNovelById(id) {
        const novel = await this.novelRepository.findOne({
            where: { id },
            relations: [
                "creator",
                "genre",
                "participants",
                "chapters",
                "aiGeneratedImages",
            ],
        });
        if (!novel) {
            throw new common_1.NotFoundException(`Novel with ID ${id} not found`);
        }
        return novel;
    }
    async create(novelData) {
        const novel = this.novelRepository.create(novelData);
        return await this.novelRepository.save(novel);
    }
    async remove(id) {
        const result = await this.novelRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Novel with ID ${id} not found`);
        }
    }
};
exports.NovelService = NovelService;
exports.NovelService = NovelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(novel_entity_1.Novel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NovelService);
//# sourceMappingURL=novel.service.js.map