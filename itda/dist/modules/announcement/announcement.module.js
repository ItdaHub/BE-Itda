"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const announcement_entity_1 = require("./entities/announcement.entity");
const announcement_service_1 = require("./announcement.service");
const announcement_controller_1 = require("./announcement.controller");
const announcementread_entity_1 = require("./entities/announcementread.entity");
const user_module_1 = require("../users/user.module");
let AnnouncementModule = class AnnouncementModule {
};
exports.AnnouncementModule = AnnouncementModule;
exports.AnnouncementModule = AnnouncementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([announcement_entity_1.Announcement, announcementread_entity_1.AnnouncementRead]),
            user_module_1.UserModule,
        ],
        providers: [announcement_service_1.AnnouncementService],
        controllers: [announcement_controller_1.AnnouncementController],
    })
], AnnouncementModule);
//# sourceMappingURL=announcement.module.js.map