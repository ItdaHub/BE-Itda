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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const payment_entity_1 = require("./payment.entity");
const jwtauth_guard_1 = require("../auth/jwtauth.guard");
const swagger_1 = require("@nestjs/swagger");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createPayment(userId, amount, method) {
        return this.paymentsService.createPayment(userId, amount, method);
    }
    async confirmTossPayment(body) {
        const { paymentKey, orderId, amount } = body;
        if (!paymentKey || !orderId || !amount) {
            return { statusCode: 400, message: "필수 파라미터가 누락되었습니다." };
        }
        try {
            const result = await this.paymentsService.confirmTossPayment({
                paymentKey,
                orderId,
                amount,
            });
            if (result.status === payment_entity_1.PaymentStatus.COMPLETED) {
                return { statusCode: 200, message: "결제 승인 처리 완료" };
            }
            else {
                return { statusCode: 400, message: "결제 승인 실패" };
            }
        }
        catch (error) {
            console.error("결제 승인 처리 중 오류:", error);
            return { statusCode: 500, message: "서버 오류 발생" };
        }
    }
    async confirmPayment(paymentId, status) {
        return this.paymentsService.confirmPayment(paymentId, status);
    }
    async getPaymentById(paymentId) {
        return this.paymentsService.getPaymentById(paymentId);
    }
    async getPaymentsByUser(req) {
        const userId = req.user.id;
        return this.paymentsService.getPaymentsByUser(userId);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)("create"),
    (0, swagger_1.ApiOperation)({
        summary: "결제 요청",
        description: "사용자가 결제를 요청합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "결제 요청 성공" }),
    __param(0, (0, common_1.Body)("userId")),
    __param(1, (0, common_1.Body)("amount")),
    __param(2, (0, common_1.Body)("method")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)("confirm"),
    (0, swagger_1.ApiOperation)({
        summary: "Toss 결제 승인 요청",
        description: "Toss 결제 완료 후 paymentKey, orderId, amount로 결제 상태를 승인 처리합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "결제 승인 처리 완료" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "confirmTossPayment", null);
__decorate([
    (0, common_1.Post)("confirm/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "결제 승인 (수동)",
        description: "결제 ID로 상태를 수동으로 승인 처리합니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, description: "결제 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "결제 승인 성공" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({
        summary: "결제 정보 조회",
        description: "결제 ID로 결제 정보를 조회합니다.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: Number, description: "결제 ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "결제 정보 조회 성공" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentById", null);
__decorate([
    (0, common_1.Get)("my-payments"),
    (0, common_1.UseGuards)(jwtauth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "내 결제 내역 조회",
        description: "JWT 토큰을 기반으로 내가 한 결제 내역을 조회합니다.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "내 결제 내역 조회 성공" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentsByUser", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)("Payments"),
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [payment_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payment.controller.js.map