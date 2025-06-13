import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Banner } from "./entities/banner.entity";

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>
  ) {}

  // 모든 배너 가져오기 (최신순 정렬)
  async findAll(): Promise<Banner[]> {
    return this.bannerRepository.find({ order: { created_at: "DESC" } });
  }

  // 특정 배너 조회
  async findById(id: number) {
    return this.bannerRepository.findOne({
      where: { id },
    });
  }

  // 배너 생성
  async create(title: string, imagePath: string): Promise<Banner> {
    const banner = this.bannerRepository.create({
      title,
      image_path: imagePath,
    });
    return this.bannerRepository.save(banner);
  }

  // 배너 삭제
  async remove(id: number): Promise<void> {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new Error("배너를 찾을 수 없습니다.");
    }
    await this.bannerRepository.remove(banner);
  }
}
