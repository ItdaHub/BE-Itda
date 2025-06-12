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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
const swagger_1 = require("@nestjs/swagger");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getUserNotifications(req) {
        const user = req.user;
        return this.notificationService.getUserNotifications(user.id);
    }
    async markNotificationAsRead(notificationId, userId, novelId) {
        return this.notificationService.markNotificationAsRead(notificationId, userId, novelId);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "유저 알림 목록 조회",
        description: "로그인한 유저의 알림 리스트를 조회합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "알림 목록 반환" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.Patch)(":notificationId/read"),
    (0, swagger_1.ApiOperation)({
        summary: "알림 읽음 처리",
        description: "특정 알림을 읽음 상태로 변경합니다.",
    }),
    (0, swagger_1.ApiParam)({
        name: "notificationId",
        type: Number,
        description: "읽음 처리할 알림 ID",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            required: ["userId", "novelId"],
            properties: {
                userId: { type: "number", example: 1 },
                novelId: { type: "number", example: 42 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "읽음 처리된 알림 반환" }),
    __param(0, (0, common_1.Param)("notificationId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)("userId")),
    __param(2, (0, common_1.Body)("novelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markNotificationAsRead", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)("알림(Notification)"),
    (0, common_1.Controller)("notifications"),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map