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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
const swagger_1 = require("@nestjs/swagger");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    preparePayment(paymentData, req) {
        return this.paymentService.preparePayment(paymentData, req.user);
    }
    handleSuccess(data) {
        return this.paymentService.handleSuccess(data);
    }
    handleFail(data) {
        return this.paymentService.handleFail(data);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("prepare"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "결제 준비",
        description: "결제를 위한 주문 정보를 생성합니다. JWT 인증이 필요합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "결제 정보 준비 완료" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "preparePayment", null);
__decorate([
    (0, common_1.Post)("success"),
    (0, swagger_1.ApiOperation)({
        summary: "결제 성공 처리",
        description: "Toss 결제 성공 시 호출되는 콜백 API입니다. 결제 상태를 '성공'으로 기록합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "결제 성공 처리 완료" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "handleSuccess", null);
__decorate([
    (0, common_1.Post)("fail"),
    (0, swagger_1.ApiOperation)({
        summary: "결제 실패 처리",
        description: "Toss 결제 실패 시 호출되는 콜백 API입니다. 결제 상태를 '실패'로 기록합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "결제 실패 처리 완료" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "handleFail", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)("Payments"),
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map