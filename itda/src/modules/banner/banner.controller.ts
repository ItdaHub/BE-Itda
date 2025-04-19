import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Delete,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { BannerService } from "./banner.service";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("banner")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // 배너 목록 조회
  @Get()
  async getBanners() {
    return this.bannerService.findAll();
  }

  @Post("register")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads/banners",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `banner-${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
  async registerBanner(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; url: string }
  ) {
    console.log("파일 정보:", file);
    console.log("본문 데이터:", body);

    const imagePath = `/uploads/banners/${file.filename}`;
    console.log("이미지 경로:", imagePath);

    const banner = await this.bannerService.create(
      body.title,
      body.url,
      imagePath
    );
    return banner;
  }

  // 배너 삭제
  @Delete(":id")
  async deleteBanner(@Param("id") id: number) {
    try {
      await this.bannerService.remove(id);
      return { message: "배너가 삭제되었습니다." };
    } catch (error) {
      return { message: "배너 삭제에 실패했습니다.", error: error.message };
    }
  }
}
