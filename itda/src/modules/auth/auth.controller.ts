import { Controller, Post, Body, Request, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./localauth.guard";
import { KakaoStrategy } from "./kakao.strategy";
import { AuthGuard } from "@nestjs/passport";
import { NaverStrategy } from "./naver.strategy";
import { GoogleStrategy } from "./google.strategy";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "회원가입",
    description: "새로운 사용자를 등록합니다.",
  })
  @ApiResponse({ status: 201, description: "회원가입 성공" })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // 로그인
  @UseGuards(LocalAuthGuard)
  @ApiTags("login")
  @Post("login")
  async login(@Request() req) {
    // 로그인한 사용자 정보를 기반으로 JWT 토큰 반환
    return this.authService.login(req.user);
  }

  // 카카오 로그인
  @UseGuards(AuthGuard("kakao"))
  @Post("kakao")
  async kakaoLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // 네이버 로그인
  @UseGuards(AuthGuard("naver"))
  @Post("naver")
  async naverLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // 구글 로그인
  @UseGuards(AuthGuard("google"))
  @Post("google")
  async googleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
}
