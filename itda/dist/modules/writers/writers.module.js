"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WritersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const writers_controller_1 = require("./writers.controller");
const writers_service_1 = require("./writers.service");
const chapter_entity_1 = require("../chapter/chapter.entity");
let WritersModule = class WritersModule {
};
exports.WritersModule = WritersModule;
exports.WritersModule = WritersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chapter_entity_1.Chapter])],
        controllers: [writers_controller_1.WritersController],
        providers: [writers_service_1.WritersService],
    })
], WritersModule);
//# sourceMappingURL=writers.module.js.map