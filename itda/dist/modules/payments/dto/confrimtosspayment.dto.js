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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmTossPaymentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ConfirmTossPaymentDto {
    paymentKey;
    orderId;
    amount;
}
exports.ConfirmTossPaymentDto = ConfirmTossPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "pay_3p7xU2R2kX4N2zLq9zPjF",
        description: "토스 결제 고유 키 (paymentKey)",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfirmTossPaymentDto.prototype, "paymentKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "order_123456789",
        description: "상점에서 생성한 주문 ID",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfirmTossPaymentDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10000,
        description: "결제 금액 (원화 단위)",
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ConfirmTossPaymentDto.prototype, "amount", void 0);
//# sourceMappingURL=confrimtosspayment.dto.js.map