"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const report_entity_1 = require("./entities/report.entity");
const report_controller_1 = require("./report.controller");
const report_service_1 = require("./report.service");
const comment_entity_1 = require("../comments/entities/comment.entity");
const chapter_entity_1 = require("../chapter/entities/chapter.entity");
const user_entity_1 = require("../users/entities/user.entity");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const user_module_1 = require("../users/user.module");
const comment_module_1 = require("..//comments/comment.module");
const chapter_module_1 = require("../chapter/chapter.module");
const notification_module_1 = require("../notifications/notification.module");
let ReportModule = class ReportModule {
};
exports.ReportModule = ReportModule;
exports.ReportModule = ReportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([report_entity_1.Report, comment_entity_1.Comment, chapter_entity_1.Chapter, user_entity_1.User, notification_entity_1.Notification]),
            user_module_1.UserModule,
            comment_module_1.CommentsModule,
            chapter_module_1.ChapterModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [report_controller_1.ReportController],
        providers: [report_service_1.ReportService],
    })
], ReportModule);
//# sourceMappingURL=report.module.js.map