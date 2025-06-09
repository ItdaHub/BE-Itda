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
  Query,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./localauth.guard";
import { AuthGuard } from "@nestjs/passport";
import { RegisterDto } from "./dto/register.dto";
import { EmailCheckDto } from "./dto/emailchech.dto";
import { JwtAuthGuard } from "./jwtauth.guard";
import { Response } from "express";
import { UserService } from "../users/user.service";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { MailService } from "../mail/mail.service";
import { UserType } from "../users/user.entity";

// 🔐 Auth 관련 API 컨트롤러
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) {}

  // ✅ 로그인된 유저 정보 가져오기
  @Get("login")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "로그인된 유저 정보 조회",
    description: "JWT 토큰을 이용해 로그인한 유저의 정보를 반환합니다.",
  })
  @ApiResponse({ status: 200, description: "유저 정보 반환 성공" })
  async getProfile(@Req() req) {
    const user = await this.userService.findById(req.user.id); // 전체 정보 가져오기
    return { user };
  }

  // ✅ 로컬 회원가입
  @Post("register")
  @ApiOperation({
    summary: "로컬 회원가입",
    description: "이메일과 비밀번호로 새로운 유저를 등록합니다.",
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
    description: "입력한 이메일이 이미 사용 중인지 확인합니다.",
  })
  @ApiResponse({ status: 200, description: "사용 가능 여부 반환" })
  async checkEmail(@Body() emailCheckDto: EmailCheckDto) {
    const { email } = emailCheckDto;
    const isEmailTaken = await this.authService.checkEmail(email);

    if (isEmailTaken) {
      throw new BadRequestException({
        success: false,
        message: "이미 사용된 이메일입니다.",
      });
    }

    return {
      success: true,
      message: "사용 가능한 이메일입니다.",
    };
  }

  // ✅ 닉네임 중복 확인
  @Post("nicknameCheck")
  @ApiOperation({
    summary: "닉네임 중복 확인",
    description: "입력한 닉네임이 이미 사용 중인지 확인합니다.",
  })
  @ApiResponse({ status: 200, description: "사용 가능 여부 반환" })
  @ApiResponse({ status: 400, description: "닉네임 중복" })
  async checkNickname(@Body("nickName") nickName: string) {
    const isNickNameTaken = await this.authService.checkNickName(nickName);

    if (isNickNameTaken) {
      throw new BadRequestException({
        success: false,
        message: "이미 사용 중인 닉네임입니다.",
      });
    }

    return {
      success: true,
      message: "사용 가능한 닉네임입니다.",
    };
  }

  // ✅ 내 정보 수정 닉네임 변경
  @Post("nicknameCheck/edit")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "닉네임 중복 확인 (내 정보 수정)",
    description:
      "입력한 닉네임이 이미 사용 중인지 확인합니다. 현재 유저의 닉네임은 예외 처리됩니다.",
  })
  @ApiResponse({ status: 200, description: "사용 가능 여부 반환" })
  async checkNicknameForEdit(@Req() req, @Body("nickName") nickName: string) {
    const user = await this.userService.findById(req.user.id);

    // 현재 닉네임과 같은 경우 => 사용 가능
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }

    if (user.nickname === nickName) {
      return { message: "현재 사용 중인 닉네임입니다.", available: true };
    }

    const isTaken = await this.authService.checkNickName(nickName);
    if (isTaken) {
      throw new BadRequestException("이미 사용 중인 닉네임입니다.");
    }

    return { message: "사용 가능한 닉네임입니다.", available: true };
  }

  // ✅ 로컬 로그인
  @UseGuards(LocalAuthGuard)
  @Post("local")
  @ApiOperation({
    summary: "로컬 로그인",
    description: "이메일과 비밀번호를 통한 로그인 처리",
  })
  @ApiResponse({ status: 200, description: "로그인 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  async login(@Request() req, @Res() res: Response) {
    const { accessToken, user } = await this.authService.login(req.user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 프론트에서 유저 정보를 사용할 수 있도록 user는 응답에 포함
    res.json({ user });
  }

  // ✅ 로그아웃
  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "로그아웃",
    description: "JWT 쿠키를 삭제하여 로그아웃 처리합니다.",
  })
  @ApiResponse({ status: 200, description: "로그아웃 성공" })
  logout(@Res() res: Response) {
    // accessToken 쿠키 삭제
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.json({ message: "로그아웃 되었습니다." });
  }

  // ✅ 카카오 로그인 요청
  @Get("kakao")
  @ApiOperation({
    summary: "카카오 로그인 요청",
    description: "카카오 로그인 인증 페이지로 리디렉트합니다.",
  })
  async kakaoLogin(@Res() res: Response) {
    const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(
      "http://localhost:5001/auth/callback/kakao"
    );

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(kakaoAuthUrl);
  }

  // ✅ 카카오 로그인 콜백 처리
  @Get("callback/kakao")
  @UseGuards(AuthGuard("kakao"))
  @ApiOperation({
    summary: "카카오 로그인 콜백",
    description:
      "카카오 로그인 성공 후 JWT 발급, 쿠키 저장, 클라이언트로 리디렉트",
  })
  async kakaoCallback(@Req() req, @Res() res: Response) {
    const { accessToken, user } = await this.authService.login(req.user);

    // JWT 토큰을 쿠키로 저장
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:3000/auth/callback");
  }

  // ✅ 네이버 로그인 요청
  @Get("naver")
  @ApiOperation({
    summary: "네이버 로그인 요청",
    description: "네이버 로그인 인증 페이지로 리디렉트합니다.",
  })
  async naverLogin(@Res() res: Response) {
    const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(
      "http://localhost:5001/auth/callback/naver"
    );

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email name nickname age birthday mobile`;
    res.redirect(naverAuthUrl);
  }

  // ✅ 네이버 로그인 콜백 처리
  @Get("callback/naver")
  @UseGuards(AuthGuard("naver"))
  @ApiOperation({
    summary: "네이버 로그인 콜백",
    description: "JWT 발급 후 쿠키에 저장하고 클라이언트로 리디렉트",
  })
  async naverCallback(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.login(req.user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:3000/auth/callback");
  }

  // ✅ 구글 로그인 요청
  @Get("google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({
    summary: "구글 로그인 요청",
    description: "구글 로그인 인증 페이지로 리디렉트합니다.",
  })
  async googleLogin() {
    return;
  }

  // ✅ 구글 로그인 콜백 처리
  @Get("callback/google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({
    summary: "구글 로그인 콜백",
    description: "JWT 발급 후 쿠키에 저장하고 클라이언트로 리디렉트",
  })
  async googleCallback(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.login(req.user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:3000/auth/callback");
  }

  // ✅ 전화번호로 이메일(ID) 찾기
  @Get("findid")
  @ApiOperation({
    summary: "전화번호로 ID 찾기",
    description: "입력한 전화번호와 일치하는 이메일을 반환합니다.",
  })
  @ApiQuery({ name: "phone", type: String })
  @ApiResponse({ status: 200, description: "ID 반환 성공" })
  @ApiResponse({ status: 404, description: "유저를 찾을 수 없음" })
  async findIdByPhone(@Query("phone") phone: string) {
    const user = await this.userService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException("일치하는 유저를 찾을 수 없습니다.");
    }
    return { id: user.email };
  }

  // ✅ 비밀번호 찾기 (임시 확인용)
  @Post("findpw")
  @ApiOperation({
    summary: "비밀번호 찾기",
    description: "이메일로 유저가 존재하는지 확인합니다.",
  })
  @ApiBody({ schema: { properties: { email: { type: "string" } } } })
  async findPassword(@Body() body: { email: string }) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      return { message: "User not found", data: null };
    }
    return { message: "User found", data: user.email };
  }

  // ✅ 비밀번호 재설정
  @Post("updatePw")
  @ApiOperation({
    summary: "비밀번호 변경",
    description: "새 비밀번호로 유저 비밀번호를 변경합니다.",
  })
  @ApiBody({
    schema: {
      properties: {
        email: { type: "string" },
        password: { type: "string", format: "password" },
      },
    },
  })
  async updatePassword(@Body() body: { email: string; password: string }) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      return { message: "User not found" };
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    user.password = hashedPassword;
    await this.userService.save(user);

    return { message: "Password updated successfully" };
  }

  // ✅ 비밀번호 메일 전송
  @Post("forgot-password")
  @ApiOperation({
    summary: "비밀번호 재설정 메일 전송",
    description: "입력된 이메일로 비밀번호 재설정 메일을 전송합니다.",
  })
  @ApiBody({ schema: { properties: { email: { type: "string" } } } })
  @ApiResponse({ status: 200, description: "메일 전송 성공" })
  async forgotPassword(@Body("email") email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException("존재하지 않는 이메일입니다.");
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    await this.mailService.sendPasswordResetEmail(email, token);

    return { message: "비밀번호 재설정 메일을 전송했습니다." };
  }

  // ✅ 비밀번호 재설정
  @Post("reset-password")
  @ApiOperation({
    summary: "비밀번호 재설정",
    description: "토큰을 기반으로 새 비밀번호를 설정합니다.",
  })
  @ApiBody({
    schema: {
      properties: {
        token: { type: "string" },
        newPassword: { type: "string", format: "password" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "비밀번호 재설정 성공" })
  @ApiResponse({ status: 400, description: "유효하지 않거나 만료된 토큰" })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    try {
      const payload: any = jwt.verify(
        body.token,
        process.env.JWT_REFRESH_SECRET!
      );
      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new NotFoundException("유저를 찾을 수 없습니다.");

      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      user.password = hashedPassword;
      await this.userService.save(user);

      return { message: "비밀번호가 성공적으로 변경되었습니다." };
    } catch {
      throw new BadRequestException("토큰이 유효하지 않거나 만료되었습니다.");
    }
  }

  // ✅ 비밀번호 재설정 페이지
  @Get("update-password")
  @ApiOperation({
    summary: "비밀번호 변경 페이지",
    description: "사용자가 비밀번호를 변경할 수 있는 페이지입니다.",
  })
  @ApiQuery({ name: "token", type: String })
  @ApiResponse({ status: 200, description: "페이지 접근 성공" })
  @ApiResponse({ status: 400, description: "유효하지 않은 토큰" })
  async updatePasswordPage(@Query("token") token: string) {
    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new NotFoundException("유저를 찾을 수 없습니다.");
      }

      return {
        message: "비밀번호를 변경할 수 있는 페이지입니다.",
        userId: user.id,
      };
    } catch {
      throw new BadRequestException("유효하지 않거나 만료된 토큰입니다.");
    }
  }

  // ✅ 관리자 로그인
  @UseGuards(LocalAuthGuard)
  @Post("admin/login")
  @ApiOperation({
    summary: "관리자 로그인",
    description: "관리자 이메일과 비밀번호를 통한 로그인 처리",
  })
  @ApiBody({
    schema: {
      properties: {
        email: { type: "string" },
        password: { type: "string", format: "password" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "로그인 성공" })
  @ApiResponse({ status: 401, description: "인증 실패 또는 관리자 아님" })
  async adminLogin(@Request() req, @Res() res: Response) {
    const { accessToken, user } = await this.authService.login(req.user);

    if (user.user_type !== "admin") {
      throw new UnauthorizedException("관리자 권한이 없습니다.");
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user });
  }
}
