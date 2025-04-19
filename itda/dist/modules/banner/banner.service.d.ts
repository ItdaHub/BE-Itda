import { Repository } from "typeorm";
import { Banner } from "./banner.entity";
export declare class BannerService {
    private readonly bannerRepo;
    constructor(bannerRepo: Repository<Banner>);
    findAll(): Promise<Banner[]>;
    create(title: string, url: string, imagePath: string): Promise<Banner>;
    remove(id: number): Promise<void>;
}
