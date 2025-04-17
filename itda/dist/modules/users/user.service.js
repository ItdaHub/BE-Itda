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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const point_entity_1 = require("../points/point.entity");
let UserService = class UserService {
    userRepository;
    pointRepository;
    constructor(userRepository, pointRepository) {
        this.userRepository = userRepository;
        this.pointRepository = pointRepository;
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async create(userDto) {
        const user = this.userRepository.create(userDto);
        return this.userRepository.save(user);
    }
    async update(id, user) {
        const { password, nickname, phone, profile_img } = user;
        const updateData = {};
        if (password)
            updateData.password = password;
        if (nickname)
            updateData.nickname = nickname;
        if (phone)
            updateData.phone = phone;
        if (profile_img)
            updateData.profile_img = profile_img;
        await this.userRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(userId, requestUser) {
        if (userId !== requestUser.id) {
            throw new common_1.ForbiddenException("본인 계정만 탈퇴할 수 있습니다.");
        }
        await this.deleteUserAndRelatedData(userId);
    }
    async findByPhone(phone) {
        return await this.userRepository.findOne({
            where: { phone },
        });
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async save(user) {
        return this.userRepository.save(user);
    }
    async findById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async removeByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException("유저를 찾을 수 없습니다.");
        }
        await this.userRepository.remove(user);
    }
    async updateProfileImage(userId, filename) {
        const user = await this.findOne(userId);
        user.profile_img = filename;
        await this.userRepository.save(user);
    }
    async removeMultiple(ids) {
        await this.userRepository.delete(ids);
    }
    async deleteUsersByAdmin(userIds) {
        for (const userId of userIds) {
            await this.deleteUserAndRelatedData(userId);
        }
    }
    async deleteUserAndRelatedData(userId) {
        const where = { user: { id: userId } };
        await this.pointRepository.delete(where);
        const deleteResult = await this.userRepository.delete(userId);
        if (deleteResult.affected === 0) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(point_entity_1.Point)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map