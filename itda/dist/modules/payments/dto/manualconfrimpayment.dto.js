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
exports.ManualConfirmPaymentDto = void 0;
const class_validator_1 = require("class-validator");
const payment_entity_1 = require("../entities/payment.entity");
class ManualConfirmPaymentDto {
    status;
}
exports.ManualConfirmPaymentDto = ManualConfirmPaymentDto;
__decorate([
    (0, class_validator_1.IsEnum)(payment_entity_1.PaymentStatus),
    __metadata("design:type", String)
], ManualConfirmPaymentDto.prototype, "status", void 0);
//# sourceMappingURL=manualconfrimpayment.dto.js.map