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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("./report.entity");
const comment_entity_1 = require("../comments/comment.entity");
const chapter_entity_1 = require("../chapter/chapter.entity");
let ReportService = class ReportService {
    reportRepository;
    commentRepository;
    chapterRepository;
    constructor(reportRepository, commentRepository, chapterRepository) {
        this.reportRepository = reportRepository;
        this.commentRepository = commentRepository;
        this.chapterRepository = chapterRepository;
    }
    async findAll() {
        return this.reportRepository.find({ relations: ["reporter"] });
    }
    async findOne(id) {
        const report = await this.reportRepository.findOne({
            where: { id },
            relations: ["reporter"],
        });
        if (!report) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
        return report;
    }
    async create(report) {
        console.log("🎯 Reporting:", report);
        if (report.target_type === report_entity_1.TargetType.COMMENT) {
            const comment = await this.commentRepository.findOneBy({
                id: report.target_id,
            });
            if (!comment)
                throw new common_1.NotFoundException("댓글을 찾을 수 없습니다.");
            report.reported_content = comment.content;
            console.log("📝 Reported Content (Comment):", report.reported_content);
        }
        else if (report.target_type === report_entity_1.TargetType.CHAPTER) {
            const chapter = await this.chapterRepository.findOne({
                where: { id: report.target_id },
                relations: ["novel"],
            });
            if (!chapter)
                throw new common_1.NotFoundException("챕터를 찾을 수 없습니다.");
            report.reported_content = `[${chapter.novel.title} - ${chapter.chapter_number}화]\n${chapter.content}`;
            console.log("📝 Reported Content (Chapter):", report.reported_content);
        }
        console.log("✅ Saving Report:", report);
        return this.reportRepository.save(report);
    }
    async delete(id) {
        const report = await this.reportRepository.findOne({ where: { id } });
        if (!report)
            return false;
        await this.reportRepository.remove(report);
        return true;
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(2, (0, typeorm_1.InjectRepository)(chapter_entity_1.Chapter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportService);
//# sourceMappingURL=report.service.js.map