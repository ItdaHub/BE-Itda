import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  Request,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./localauth.guard";
import { AuthGuard } from "@nestjs/passport";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./jwtauth.guard";
import { Response } from "express";

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
    summary: "로컬 회원가입",
    description: "이메일과 비밀번호로 로컬 회원을 등록합니다.",
  })
  @ApiResponse({ status: 201, description: "회원가입 성공" })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ✅ 이메일 중복 확인
  @Post("emailCheck")
  @ApiOperation({
    summary: "이메일 중복 확인",
    description: "이메일이 사용 중인지 확인합니다.",
  })
  async checkEmail(@Body("email") email: string) {
    const isEmailTaken = await this.authService.checkEmail(email);
    if (isEmailTaken) {
      throw new BadRequestException("이미 사용된 이메일입니다.");
    }
    return { message: "사용 가능한 이메일입니다." };
  }

  // ✅ 닉네임 중복 확인
  @Post("nicknameCheck")
  @ApiOperation({
    summary: "닉네임 중복 확인",
    description: "닉네임이 사용 중인지 확인합니다.",
  })
  async checkNickName(@Body("nickName") nickName: string) {
    const isNickNameTaken = await this.authService.checkNickName(nickName);
    if (isNickNameTaken) {
      throw new BadRequestException("이미 사용된 닉네임입니다.");
    }
    return { message: "사용 가능한 닉네임입니다." };
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
  @ApiOperation({
    summary: "카카오 로그인",
    description: "카카오 로그인 페이지로 리디렉트합니다.",
  })
  async kakaoLogin(@Res() res: Response) {
    const KAKAO_CLIENT_ID = "170ea69c85667e150fa103eab9a19c35";
    const REDIRECT_URI = encodeURIComponent(
      "http://localhost:5001/auth/callback/kakao"
    );

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

    res.redirect(kakaoAuthUrl);
  }

  // ✅ 카카오 로그인 콜백 (JWT 발급)
  // @Get("callback/kakao")
  // @UseGuards(AuthGuard("kakao"))
  // async kakaoAuthRedirect(@Req() req, @Res() res) {
  //   const { token, user } = await this.authService.login(req.user);
  //   console.log("📌 카카오 응답:", { token, user });
  //   return res.json(await this.authService.login(req.user));
  // }
  @Get("callback/kakao")
  @UseGuards(AuthGuard("kakao"))
  async kakaoAuthRedirect(@Req() req, @Res() res) {
    const { accessToken, user } = await this.authService.login(req.user);
    const userStr = encodeURIComponent(JSON.stringify(user));
    const redirectUrl = `http://localhost:3000/auth/callback?token=${accessToken}&user=${userStr}`;
    res.redirect(redirectUrl);
  }

  // ✅ 네이버 로그인
  @Get("naver")
  @ApiOperation({
    summary: "네이버 로그인",
    description: "네이버 로그인 페이지로 리디렉트합니다.",
  })
  async naverLogin(@Res() res: Response) {
    const NAVER_CLIENT_ID = "CS8Gw4DSASCoHi8BhBmA";
    const REDIRECT_URI = encodeURIComponent(
      "http://localhost:5001/auth/callback/naver"
    );

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email name nickname age birthday mobile`;

    res.redirect(naverAuthUrl);
  }

  // ✅ 네이버 로그인 콜백 (JWT 발급)
  @Get("callback/naver")
  @UseGuards(AuthGuard("naver"))
  @ApiOperation({
    summary: "네이버 로그인 콜백",
    description: "네이버 로그인 후 JWT 발급",
  })
  async naverCallback(@Req() req, @Res() res) {
    const { accessToken, user } = await this.authService.login(req.user);
    const userStr = encodeURIComponent(JSON.stringify(user));
    const redirectUrl = `http://localhost:3000/auth/callback?token=${accessToken}&user=${userStr}`;
    res.redirect(redirectUrl);
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

  // ✅ 구글 로그인 콜백
  @Get("callback/google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({
    summary: "구글 로그인 콜백",
    description: "구글 로그인 후 JWT 발급",
  })
  async googleCallback(@Req() req, @Res() res) {
    const { accessToken, user } = await this.authService.login(req.user);
    const userStr = encodeURIComponent(JSON.stringify(user));
    const redirectUrl = `http://localhost:3000/auth/callback?token=${accessToken}&user=${userStr}`;
    res.redirect(redirectUrl);
  }
}
