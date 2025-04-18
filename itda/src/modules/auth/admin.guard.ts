import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // JwtAuthGuard를 통해 추출된 사용자 정보

    // 여기에서 사용자 정보(user)를 기반으로 관리자 권한이 있는지 확인하는 로직을 구현합니다.
    // 예를 들어, user 객체에 isAdmin 속성이 있거나, 특정 role을 가지고 있는지 확인할 수 있습니다.
    if (user && user.isAdmin === true) {
      return true; // 관리자 권한이 있으면 접근 허용
    }

    // 관리자 권한이 없으면 UnauthorizedException 발생
    throw new UnauthorizedException("관리자 권한이 필요합니다.");
  }
}
