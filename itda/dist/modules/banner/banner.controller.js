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
exports.BannerController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const banner_service_1 = require("./banner.service");
const multer_1 = require("multer");
const path_1 = require("path");
let BannerController = class BannerController {
    bannerService;
    constructor(bannerService) {
        this.bannerService = bannerService;
    }
    async getBanners() {
        return this.bannerService.findAll();
    }
    async getBanner(id) {
        try {
            const banner = await this.bannerService.findById(id);
            if (!banner) {
                return { message: `배너 ${id}를 찾을 수 없습니다.` };
            }
            return banner;
        }
        catch (error) {
            return { message: "배너 조회에 실패했습니다.", error: error.message };
        }
    }
    async registerBanner(file, body) {
        console.log("파일 정보:", file);
        console.log("본문 데이터:", body);
        const imagePath = `/uploads/banners/${file.filename}`;
        console.log("이미지 경로:", imagePath);
        const banner = await this.bannerService.create(body.title, body.url, imagePath);
        return banner;
    }
    async deleteBanner(id) {
        try {
            await this.bannerService.remove(id);
            return { message: "배너가 삭제되었습니다." };
        }
        catch (error) {
            return { message: "배너 삭제에 실패했습니다.", error: error.message };
        }
    }
};
exports.BannerController = BannerController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getBanners", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getBanner", null);
__decorate([
    (0, common_1.Post)("register"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image", {
        storage: (0, multer_1.diskStorage)({
            destination: "./uploads/banners",
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `banner-${uniqueSuffix}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "registerBanner", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "deleteBanner", null);
exports.BannerController = BannerController = __decorate([
    (0, common_1.Controller)("banner"),
    __metadata("design:paramtypes", [banner_service_1.BannerService])
], BannerController);
//# sourceMappingURL=banner.controller.js.map