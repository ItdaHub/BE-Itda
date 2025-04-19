import { BannerService } from "./banner.service";
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    getBanners(): Promise<import("./banner.entity").Banner[]>;
    getBanner(id: number): Promise<import("./banner.entity").Banner | {
        message: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
    }>;
    registerBanner(file: Express.Multer.File, body: {
        title: string;
        url: string;
    }): Promise<import("./banner.entity").Banner>;
    deleteBanner(id: number): Promise<{
        message: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
    }>;
}
