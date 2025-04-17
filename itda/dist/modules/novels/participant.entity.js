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
exports.Participant = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const novel_entity_1 = require("./novel.entity");
let Participant = class Participant {
    id;
    novel;
    user;
    order_number;
    joined_at;
};
exports.Participant = Participant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Participant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => novel_entity_1.Novel, (novel) => novel.participants, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "novel_id" }),
    __metadata("design:type", novel_entity_1.Novel)
], Participant.prototype, "novel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.participations, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], Participant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Participant.prototype, "order_number", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Participant.prototype, "joined_at", void 0);
exports.Participant = Participant = __decorate([
    (0, typeorm_1.Entity)("participants")
], Participant);
//# sourceMappingURL=participant.entity.js.map