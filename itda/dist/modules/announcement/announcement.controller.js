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
exports.AnnouncementController = void 0;
const common_1 = require("@nestjs/common");
const announcement_service_1 = require("./announcement.service");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
let AnnouncementController = class AnnouncementController {
    announcementService;
    constructor(announcementService) {
        this.announcementService = announcementService;
    }
    async createAnnouncement(req, body) {
        console.log("📢 컨트롤러 register body:", body);
        const { title, content, priority } = body;
        const admin = req.user;
        return this.announcementService.createAnnouncement(title, content, admin, priority);
    }
    async deleteAnnouncement(id) {
        return this.announcementService.deleteAnnouncement(Number(id));
    }
    async getAllAnnouncements() {
        return this.announcementService.getAllAnnouncements();
    }
    async getAnnouncement(id) {
        console.log("🚀 GET /announcement/:id 요청 들어옴, id:", id);
        return this.announcementService.getAnnouncementById(Number(id));
    }
    async updateAnnouncement(id, body) {
        const { title, content, priority } = body;
        return this.announcementService.updateAnnouncement(Number(id), title, content, priority);
    }
};
exports.AnnouncementController = AnnouncementController;
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "createAnnouncement", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "deleteAnnouncement", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "getAllAnnouncements", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "getAnnouncement", null);
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "updateAnnouncement", null);
exports.AnnouncementController = AnnouncementController = __decorate([
    (0, common_1.Controller)("announcement"),
    __metadata("design:paramtypes", [announcement_service_1.AnnouncementService])
], AnnouncementController);
//# sourceMappingURL=announcement.controller.js.map