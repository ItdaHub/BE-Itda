"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NovelModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const novel_controller_1 = require("./novel.controller");
const novel_service_1 = require("./novel.service");
const novel_entity_1 = require("./novel.entity");
const genre_entity_1 = require("../genre/genre.entity");
const chapter_entity_1 = require("../chapter/chapter.entity");
const user_entity_1 = require("../users/user.entity");
const user_module_1 = require("../users/user.module");
const participant_entity_1 = require("./participant.entity");
const notification_module_1 = require("../notifications/notification.module");
let NovelModule = class NovelModule {
};
exports.NovelModule = NovelModule;
exports.NovelModule = NovelModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([novel_entity_1.Novel, genre_entity_1.Genre, chapter_entity_1.Chapter, user_entity_1.User, participant_entity_1.Participant]),
            user_module_1.UserModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [novel_controller_1.NovelController],
        providers: [novel_service_1.NovelService],
        exports: [novel_service_1.NovelService],
    })
], NovelModule);
//# sourceMappingURL=novel.module.js.map