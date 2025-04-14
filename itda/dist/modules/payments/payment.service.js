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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./payment.entity");
const user_entity_1 = require("../users/user.entity");
const axios_1 = require("axios");
let PaymentsService = class PaymentsService {
    paymentRepo;
    userRepo;
    constructor(paymentRepo, userRepo) {
        this.paymentRepo = paymentRepo;
        this.userRepo = userRepo;
    }
    async createPayment(userId, amount, method) {
        const user = await this.userRepo.findOneByOrFail({ id: userId });
        const payment = this.paymentRepo.create({
            user,
            amount,
            method,
            status: payment_entity_1.PaymentStatus.PENDING,
        });
        return await this.paymentRepo.save(payment);
    }
    async confirmTossPayment(data) {
        const { paymentKey, orderId, amount } = data;
        if (!paymentKey || !orderId || isNaN(amount) || amount <= 0) {
            throw new common_1.HttpException("결제 정보가 올바르지 않습니다.", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await axios_1.default.post(`https://api.tosspayments.com/v1/payments/confirm`, {
                paymentKey,
                orderId,
                amount,
            }, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64")}`,
                    "Content-Type": "application/json",
                },
            });
            const tossPaymentData = response.data;
            if (!tossPaymentData || tossPaymentData.status !== "Succeed") {
                throw new common_1.HttpException("Toss 결제 승인에 실패했습니다.", common_1.HttpStatus.BAD_REQUEST);
            }
            let payment = await this.paymentRepo.findOne({
                where: { id: parseInt(orderId) },
                relations: ["user"],
            });
            if (!payment) {
                throw new common_1.HttpException("결제 정보가 존재하지 않습니다.", common_1.HttpStatus.NOT_FOUND);
            }
            payment.status = payment_entity_1.PaymentStatus.COMPLETED;
            payment.method = tossPaymentData.method;
            payment.amount = tossPaymentData.totalAmount;
            return await this.paymentRepo.save(payment);
        }
        catch (error) {
            if (error.response?.data?.code ===
                "FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING") {
                throw new common_1.HttpException("Toss 결제 시스템이 일시적으로 처리 중입니다. 잠시 후 다시 시도해주세요.", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            console.error("Toss 승인 오류:", error.response?.data || error.message);
            throw new common_1.HttpException("결제 승인에 실패했습니다.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async confirmPayment(paymentId, status) {
        const payment = await this.paymentRepo.findOne({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new Error("결제 정보를 찾을 수 없습니다.");
        }
        if (payment.status !== payment_entity_1.PaymentStatus.PENDING) {
            throw new Error("이미 결제가 처리되었습니다.");
        }
        payment.status = status;
        return await this.paymentRepo.save(payment);
    }
    async getPaymentById(paymentId) {
        const payment = await this.paymentRepo.findOne({
            where: { id: paymentId },
            relations: ["user"],
        });
        if (!payment) {
            throw new Error("결제 정보를 찾을 수 없습니다.");
        }
        return payment;
    }
    async getPaymentsByUser(userId) {
        return await this.paymentRepo.find({
            where: { user: { id: userId } },
            order: { created_at: "DESC" },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payment.service.js.map