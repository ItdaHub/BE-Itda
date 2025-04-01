import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// 로컬 로그인 인증을 위한 Guard
@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {}
