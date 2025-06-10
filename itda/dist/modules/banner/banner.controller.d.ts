import { BannerService } from "./banner.service";
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    getBanners(): Promise<import("./entities/banner.entity").Banner[]>;
    getBanner(id: number): Promise<import("./entities/banner.entity").Banner | {
        message: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
    }>;
    registerBanner(file: Express.Multer.File, body: {
        title: string;
    }): Promise<import("./entities/banner.entity").Banner>;
    deleteBanner(id: number): Promise<{
        message: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
    }>;
}
