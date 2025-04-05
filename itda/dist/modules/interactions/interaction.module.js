"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const interaction_controller_1 = require("./interaction.controller");
const interaction_service_1 = require("./interaction.service");
const vote_entity_1 = require("./vote.entity");
const comment_entity_1 = require("../comments/comment.entity");
const novel_entity_1 = require("../novels/novel.entity");
const user_entity_1 = require("../users/user.entity");
const chapter_entity_1 = require("../chapter/chapter.entity");
let InteractionsModule = class InteractionsModule {
};
exports.InteractionsModule = InteractionsModule;
exports.InteractionsModule = InteractionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vote_entity_1.Vote, comment_entity_1.Comment, novel_entity_1.Novel, user_entity_1.User, chapter_entity_1.Chapter])],
        controllers: [interaction_controller_1.InteractionsController],
        providers: [interaction_service_1.InteractionsService],
    })
], InteractionsModule);
//# sourceMappingURL=interaction.module.js.map