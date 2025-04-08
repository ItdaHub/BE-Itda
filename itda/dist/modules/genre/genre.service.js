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
exports.GenreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const genre_entity_1 = require("./genre.entity");
const typeorm_2 = require("typeorm");
let GenreService = class GenreService {
    genreRepo;
    constructor(genreRepo) {
        this.genreRepo = genreRepo;
    }
    async getAllGenres() {
        return this.genreRepo.find();
    }
    async seedGenres() {
        const genres = [
            { name: "로맨스", value: "romance" },
            { name: "판타지", value: "fantasy" },
            { name: "무협", value: "martial" },
            { name: "스릴러", value: "thriller" },
        ];
        for (const genreData of genres) {
            const exists = await this.genreRepo.findOne({
                where: { name: genreData.name },
            });
            if (!exists) {
                const genre = this.genreRepo.create(genreData);
                await this.genreRepo.save(genre);
                console.log(`✅ '${genreData.name}' 장르 저장 완료`);
            }
        }
    }
};
exports.GenreService = GenreService;
exports.GenreService = GenreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(genre_entity_1.Genre)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GenreService);
//# sourceMappingURL=genre.service.js.map