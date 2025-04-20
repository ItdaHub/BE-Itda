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
  Logger, // ✅ Logger 임포트
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { ApiTags, ApiOperation, ApiParam, ApiBody } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwtauth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { CreateUserDto } from "./dto/ceateuser.dto";
import { UpdateUserDto } from "./dto/updateuser.dto";

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
  @ApiBody({ type: CreateUserDto })
  create(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }

  // 📌 유저 정보 업데이트
  @Put(":id")
  @ApiOperation({ summary: "유저 정보 수정" })
  @ApiParam({ name: "id", description: "유저 ID" })
  @ApiBody({ type: UpdateUserDto })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() user: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(id, user);
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

  // ✅ 전화번호 변경
  @Put("me/phone")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "내 전화번호 변경" })
  @ApiBody({
    schema: { type: "object", properties: { phone: { type: "string" } } },
  })
  async updatePhone(@Request() req, @Body("phone") phone: string) {
    const userId = req.user.id;
    await this.userService.update(userId, { phone });
    return { message: "전화번호가 성공적으로 변경되었습니다.", phone };
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

  // ✅ 내 프로필 이미지 삭제
  @Delete("me/profile-image")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "내 프로필 이미지 삭제" })
  async deleteProfileImage(@Request() req): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.userService.deleteProfileImage(userId);
    return { message: "프로필 이미지가 성공적으로 삭제되었습니다." };
  }

  // ✅ 본인 회원 탈퇴 (회원 삭제)
  @Delete("me")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "내 계정 삭제 (회원 탈퇴)" })
  async deleteMyAccount(@Request() req): Promise<void> {
    const userId = req.user.id;
    const requestUser = req.user as User; // 요청 객체에서 현재 사용자 정보 추출
    await this.userService.remove(userId, requestUser); // 두 번째 인자로 requestUser 전달
  }

  // 📌 관리자에 의한 여러 유저 완전 삭제
  @Delete("admin/delete")
  @ApiOperation({ summary: "관리자가 여러 유저를 완전 삭제" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        userIds: {
          type: "array",
          items: { type: "number" },
          example: [1, 2, 3],
        },
      },
    },
  })
  async deleteUsersByAdmin(
    @Body("userIds") userIds: number[]
  ): Promise<{ message: string }> {
    await this.userService.deleteUsersByAdmin(userIds);
    return { message: "선택한 유저들이 완전히 삭제되었습니다." };
  }
}
