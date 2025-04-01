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
exports.AdminNotification = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let AdminNotification = class AdminNotification {
    id;
    admin;
    user;
    content;
    type;
    priority;
    is_read;
    created_at;
};
exports.AdminNotification = AdminNotification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AdminNotification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id),
    __metadata("design:type", user_entity_1.User)
], AdminNotification.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id),
    __metadata("design:type", user_entity_1.User)
], AdminNotification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], AdminNotification.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["announcement", "report"] }),
    __metadata("design:type", String)
], AdminNotification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["urgent", "important", "normal"] }),
    __metadata("design:type", String)
], AdminNotification.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AdminNotification.prototype, "is_read", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AdminNotification.prototype, "created_at", void 0);
exports.AdminNotification = AdminNotification = __decorate([
    (0, typeorm_1.Entity)("AdminNotification")
], AdminNotification);
//# sourceMappingURL=admin_notification.entity.js.map