import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./localauth.guard";
import { AuthGuard } from "@nestjs/passport";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./jwtauth.guard";
import { LoginType } from "../users/user.entity";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ 로그인된 유저 정보 가져오기
  @UseGuards(JwtAuthGuard)
  @Get("login")
  @ApiOperation({
    summary: "로그인된 유저 정보",
    description: "JWT 토큰을 검증하고 유저 정보를 반환합니다.",
  })
  async getLogin(@Request() req) {
    return this.authService.formatResponse(req.user);
  }

  // ✅ 회원가입
  @Post("register")
  @ApiOperation({
    summary: "회원가입",
    description: "새로운 사용자를 등록합니다.",
  })
  @ApiResponse({ status: 201, description: "회원가입 성공" })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register({
      ...registerDto,
      type: registerDto.type ?? LoginType.LOCAL,
    });
  }

  // ✅ 로컬 로그인 (이메일 & 비밀번호)
  @UseGuards(LocalAuthGuard)
  @Post("local")
  @ApiOperation({
    summary: "로컬 로그인",
    description: "이메일과 비밀번호로 로그인합니다.",
  })
  @ApiResponse({ status: 200, description: "로그인 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // ✅ 카카오 로그인
  @Get("kakao")
  @UseGuards(AuthGuard("kakao"))
  @ApiOperation({
    summary: "카카오 로그인",
    description: "카카오 로그인 페이지로 리디렉트됩니다.",
  })
  async kakaoLogin() {
    return;
  }

  // ✅ 카카오 로그인 콜백 (JWT 발급)
  @Get("callback/kakao")
  @UseGuards(AuthGuard("kakao"))
  @ApiOperation({
    summary: "카카오 로그인 콜백",
    description: "카카오 로그인 후 JWT를 반환합니다.",
  })
  async kakaoCallback(@Request() req) {
    return this.authService.login(req.user);
  }

  // ✅ 네이버 로그인
  @Get("naver")
  @UseGuards(AuthGuard("naver"))
  @ApiOperation({
    summary: "네이버 로그인",
    description: "네이버 로그인 페이지로 리디렉트됩니다.",
  })
  async naverLogin() {
    return;
  }

  // ✅ 네이버 로그인 콜백 (JWT 발급)
  @Get("callback/naver")
  @UseGuards(AuthGuard("naver"))
  @ApiOperation({
    summary: "네이버 로그인 콜백",
    description: "네이버 로그인 후 JWT를 반환합니다.",
  })
  async naverCallback(@Request() req) {
    console.log("📌 네이버 응답:", req.user);

    // 유저 정보가 정상적으로 들어오는지 확인
    if (!req.user) {
      throw new Error("네이버 로그인 실패");
    }

    // ✅ 이름이 없으면 별명(nickname) 사용
    if (!req.user.name) {
      req.user.name = req.user.nickname || "네이버 유저";
    }

    return this.authService.login(req.user);
  }

  // ✅ 구글 로그인
  @Get("google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({
    summary: "구글 로그인",
    description: "구글 로그인 페이지로 리디렉트됩니다.",
  })
  async googleLogin() {
    return;
  }

  // ✅ 구글 로그인 콜백 (JWT 발급)
  @Get("callback/google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({
    summary: "구글 로그인 콜백",
    description: "구글 로그인 후 JWT를 반환합니다.",
  })
  async googleCallback(@Request() req) {
    return this.authService.login(req.user);
  }
}
