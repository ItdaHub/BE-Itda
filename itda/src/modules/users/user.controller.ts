import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { ApiTags, ApiOperation, ApiParam, ApiBody } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@ApiTags("User (유저)")
@Controller("users")
@UseGuards(JwtAuthGuard) // ✅ 인증된 사용자만 접근 가능하도록 가드 적용 (선택 사항)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 📌 유저 전체 목록 조회
  @Get()
  @ApiOperation({ summary: "유저 전체 목록 조회" })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // 📌 유저 단일 조회
  @Get(":id")
  @ApiOperation({ summary: "유저 상세 조회" })
  @ApiParam({ name: "id", description: "유저 ID" })
  findOne(@Param("id", ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  // 📌 유저 생성
  @Post()
  @ApiOperation({ summary: "유저 생성" })
  @ApiBody({ type: User }) // 실제 요청 Body에 들어갈 타입
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  // 📌 유저 정보 업데이트
  @Put(":id")
  @ApiOperation({ summary: "유저 정보 수정" })
  @ApiParam({ name: "id", description: "유저 ID" })
  @ApiBody({ type: User }) // 업데이트할 필드 정보
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() user: Partial<User>
  ): Promise<User> {
    return this.userService.update(id, user);
  }

  // 📌 유저 삭제
  @Delete(":id")
  @ApiOperation({ summary: "유저 삭제" })
  @ApiParam({ name: "id", description: "유저 ID" })
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Delete("delete/email/:email")
  @ApiOperation({ summary: "이메일 기반 유저 삭제" })
  @ApiParam({ name: "email", description: "유저 이메일" })
  async deleteByEmail(@Param("email") email: string): Promise<void> {
    return this.userService.removeByEmail(email);
  }

  // ✅ 닉네임 변경
  @Put("me/nickname")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "내 닉네임 변경" })
  @ApiBody({
    schema: { type: "object", properties: { nickname: { type: "string" } } },
  })
  async updateNickname(@Request() req, @Body("nickname") nickname: string) {
    const userId = req.user.id;
    await this.userService.update(userId, { nickname });
    return { message: "닉네임이 성공적으로 변경되었습니다.", nickname };
  }

  // ✅ 프로필 이미지 업로드 및 업데이트
  @Put("me/profile-image")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "내 프로필 이미지 업데이트" })
  @UseInterceptors(
    FileInterceptor("profileImage", {
      storage: diskStorage({
        destination: "./uploads/profiles",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `profile-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 5 }, // 5MB 제한
    })
  )
  async uploadProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userId = req.user.id;
    if (!file) {
      return { message: "프로필 이미지를 선택해주세요." };
    }
    await this.userService.updateProfileImage(userId, file.filename);
    return {
      message: "프로필 이미지가 성공적으로 업데이트되었습니다.",
      filename: file.filename,
    };
  }
}
