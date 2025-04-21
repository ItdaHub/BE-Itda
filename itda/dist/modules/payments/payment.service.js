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
const point_service_1 = require("../points/point.service");
const point_entity_1 = require("../points/point.entity");
const axios_1 = require("axios");
let PaymentsService = class PaymentsService {
    paymentRepo;
    userRepo;
    pointService;
    constructor(paymentRepo, userRepo, pointService) {
        this.paymentRepo = paymentRepo;
        this.userRepo = userRepo;
        this.pointService = pointService;
    }
    async createPayment(userId, amount, method, orderId, type, novelId, chapterId) {
        console.log("Received create payment request:", {
            userId,
            amount,
            method,
            orderId,
            type,
            novelId,
            chapterId,
        });
        const user = await this.userRepo.findOneByOrFail({ id: userId });
        console.log("User found:", user);
        const userPoints = await this.pointService.getUserTotalPoints(userId);
        if (type === "read" && novelId && chapterId) {
            if (userPoints < amount) {
                console.log("팝콘이 부족하여 결제 요청");
                const payment = this.paymentRepo.create({
                    user,
                    amount,
                    method,
                    status: payment_entity_1.PaymentStatus.PENDING,
                    orderId,
                    type,
                    novelId,
                    chapterId,
                });
                const savedPayment = await this.paymentRepo.save(payment);
                console.log("결제 생성 완료:", savedPayment);
                return savedPayment;
            }
            else {
                await this.pointService.spendPoints({
                    userId,
                    novelId,
                    chapterId,
                    amount,
                });
                console.log("포인트 차감 완료.");
            }
        }
        const payment = this.paymentRepo.create({
            user,
            amount,
            method,
            status: payment_entity_1.PaymentStatus.PENDING,
            orderId,
            type,
            novelId,
            chapterId,
        });
        const savedPayment = await this.paymentRepo.save(payment);
        console.log("Payment saved:", savedPayment);
        return savedPayment;
    }
    async confirmTossPayment(data) {
        const { paymentKey, orderId, amount } = data;
        if (!paymentKey || !orderId || isNaN(amount) || amount <= 0) {
            throw new common_1.HttpException("결제 정보가 올바르지 않습니다.", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await axios_1.default.post(`https://api.tosspayments.com/v1/payments/confirm`, { paymentKey, orderId, amount }, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64")}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("Toss API 응답:", response.data);
            const tossPaymentData = response.data;
            if (!tossPaymentData || tossPaymentData.status !== "DONE") {
                throw new common_1.HttpException("Toss 결제 승인에 실패했습니다.", common_1.HttpStatus.BAD_REQUEST);
            }
            let payment = await this.paymentRepo.findOne({
                where: { orderId },
                relations: ["user"],
            });
            if (!payment) {
                throw new common_1.HttpException(`결제 정보가 존재하지 않습니다. orderId: ${orderId}`, common_1.HttpStatus.NOT_FOUND);
            }
            if (payment.status === payment_entity_1.PaymentStatus.COMPLETED) {
                return payment;
            }
            payment.status = payment_entity_1.PaymentStatus.COMPLETED;
            payment.method = tossPaymentData.method;
            payment.amount = tossPaymentData.totalAmount;
            const savedPayment = await this.paymentRepo.save(payment);
            await this.pointService.addPoint(savedPayment.user, savedPayment.amount, point_entity_1.PointType.EARN);
            return savedPayment;
        }
        catch (error) {
            const errorCode = error.response?.data?.code;
            console.error("Toss 결제 승인 오류:", error.response?.data || error.message);
            if (errorCode === "FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING") {
                throw new common_1.HttpException("Toss 결제 시스템이 일시적으로 처리 중입니다. 잠시 후 다시 시도해주세요.", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (errorCode === "ALREADY_PROCESSED_PAYMENT") {
                const existingPayment = await this.paymentRepo.findOne({
                    where: { orderId },
                    relations: ["user"],
                });
                if (existingPayment?.status === payment_entity_1.PaymentStatus.COMPLETED) {
                    return existingPayment;
                }
                throw new common_1.HttpException("이미 처리된 결제입니다.", common_1.HttpStatus.CONFLICT);
            }
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
        typeorm_2.Repository,
        point_service_1.PointService])
], PaymentsService);
//# sourceMappingURL=payment.service.js.map