"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const point_entity_1 = require("./entities/point.entity");
const point_service_1 = require("./point.service");
const point_controller_1 = require("./point.controller");
const user_module_1 = require("../users/user.module");
const purchases_entity_1 = require("./entities/purchases.entity");
const user_entity_1 = require("../users/entities/user.entity");
const novel_entity_1 = require("../novels/entities/novel.entity");
let PointModule = class PointModule {
};
exports.PointModule = PointModule;
exports.PointModule = PointModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([point_entity_1.Point, purchases_entity_1.Purchase, user_entity_1.User, novel_entity_1.Novel]),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
        ],
        providers: [point_service_1.PointService],
        controllers: [point_controller_1.PointController],
        exports: [point_service_1.PointService, typeorm_1.TypeOrmModule.forFeature([point_entity_1.Point])],
    })
], PointModule);
//# sourceMappingURL=point.module.js.map