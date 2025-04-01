import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 유저 전체 목록 조회
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // 유저 단일 조회
  @Get(":id")
  findOne(@Param("id") id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  // 유저 생성
  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  // 유저 업데이트
  @Put(":id")
  update(@Param("id") id: number, @Body() user: Partial<User>): Promise<User> {
    return this.userService.update(id, user);
  }

  // 유저 삭제
  @Delete(":id")
  remove(@Param("id") id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
