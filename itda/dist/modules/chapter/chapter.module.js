"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chapter_entity_1 = require("./entities/chapter.entity");
const chapter_service_1 = require("./chapter.service");
const chapter_controller_1 = require("./chapter.controller");
const novel_entity_1 = require("../novels/entities/novel.entity");
const ai_module_1 = require("../ai/ai.module");
let ChapterModule = class ChapterModule {
};
exports.ChapterModule = ChapterModule;
exports.ChapterModule = ChapterModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chapter_entity_1.Chapter, novel_entity_1.Novel]), ai_module_1.AiModule],
        providers: [chapter_service_1.ChapterService],
        controllers: [chapter_controller_1.ChapterController],
    })
], ChapterModule);
//# sourceMappingURL=chapter.module.js.map