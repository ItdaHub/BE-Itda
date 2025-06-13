import { Repository } from "typeorm";
import { Banner } from "./entities/banner.entity";
export declare class BannerService {
    private readonly bannerRepository;
    constructor(bannerRepository: Repository<Banner>);
    findAll(): Promise<Banner[]>;
    findById(id: number): Promise<Banner | null>;
    create(title: string, imagePath: string): Promise<Banner>;
    remove(id: number): Promise<void>;
}
