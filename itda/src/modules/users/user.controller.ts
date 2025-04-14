import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { ApiTags, ApiOperation, ApiParam, ApiBody } from "@nestjs/swagger";

@ApiTags("User (유저)")
@Controller("users")
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
}
