"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const comment_service_1 = require("./comment.service");
const comment_controller_1 = require("./comment.controller");
const comment_entity_1 = require("./entities/comment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const novel_entity_1 = require("../novels/entities/novel.entity");
const chapter_entity_1 = require("../chapter/entities/chapter.entity");
const report_entity_1 = require("../reports/entities/report.entity");
let CommentsModule = class CommentsModule {
};
exports.CommentsModule = CommentsModule;
exports.CommentsModule = CommentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([comment_entity_1.Comment, user_entity_1.User, novel_entity_1.Novel, chapter_entity_1.Chapter, report_entity_1.Report])],
        controllers: [comment_controller_1.CommentsController],
        providers: [comment_service_1.CommentsService],
    })
], CommentsModule);
//# sourceMappingURL=comment.module.js.map