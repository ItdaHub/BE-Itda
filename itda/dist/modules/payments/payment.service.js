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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./payment.entity");
const user_entity_1 = require("../users/user.entity");
let PaymentService = class PaymentService {
    paymentRepository;
    userRepository;
    constructor(paymentRepository, userRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }
    async preparePayment(data, user) {
        const { amount, method } = data;
        const payment = this.paymentRepository.create({
            user,
            amount,
            method,
            status: "pending",
        });
        await this.paymentRepository.save(payment);
        return { message: "결제 준비 완료", orderId: payment.id };
    }
    async handleSuccess(data) {
        const { orderId } = data;
        const payment = await this.paymentRepository.findOne({
            where: { id: orderId },
        });
        if (!payment)
            throw new Error("결제 정보가 없습니다.");
        payment.status = "completed";
        await this.paymentRepository.save(payment);
        return { message: "결제 완료 처리됨" };
    }
    async handleFail(data) {
        const { orderId } = data;
        const payment = await this.paymentRepository.findOne({
            where: { id: orderId },
        });
        if (payment) {
            payment.status = "failed";
            await this.paymentRepository.save(payment);
        }
        return { message: "결제 실패 처리됨" };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map