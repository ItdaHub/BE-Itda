import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserType } from "./entities/user.entity";
import { Point } from "../points/entities/point.entity";
import { FindOptionsWhere } from "typeorm";
import { CreateUserDto } from "./dto/ceateuser.dto";
import * as bcrypt from "bcryptjs";
import { unlink } from "fs/promises";
import { join } from "path";
import { Logger } from "@nestjs/common";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>
  ) {}

  // 유저 전체 목록 조회
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // 유저 단일 조회
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // 유저 생성
  async create(userDto: CreateUserDto): Promise<User> {
    console.log("🔥 전달된 userDto:", userDto); // 👈 요기!

    // 👑 user_type 유효성 검사 및 기본값 설정
    const validRoles = [UserType.USER, UserType.ADMIN];
    const userType = userDto.user_type ?? UserType.USER;

    if (!validRoles.includes(userType)) {
      throw new ForbiddenException("Invalid user_type value");
    }

    const hashedPassword = userDto.password
      ? await bcrypt.hash(userDto.password, 10)
      : null;

    const newUser = this.userRepository.create({
      password: hashedPassword,
      user_type: userType,
      ...userDto,
    });

    return this.userRepository.save(newUser);
  }

  // 유저 업데이트
  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    console.log("🔥 업데이트 요청 데이터:", userData);

    // 비밀번호가 포함된 경우 비밀번호 처리 (비밀번호 변경 로직)
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // 상태 업데이트 (활동/정지)
    if (userData.status) {
      console.log("📛 상태 변경 요청:", userData.status);
      const validStatuses = ["active", "stop"];
      if (!validStatuses.includes(userData.status)) {
        throw new ForbiddenException("Invalid status value");
      }
      user.status = userData.status;
    }

    // 권한 업데이트 (user/admin)
    if (userData.user_type) {
      console.log("👑 권한 변경 요청:", userData.user_type);
      const validRoles = [UserType.USER, UserType.ADMIN];
      if (!validRoles.includes(userData.user_type)) {
        throw new ForbiddenException("Invalid user_type value");
      }
      user.user_type = userData.user_type;
    }

    Object.assign(user, userData);

    const savedUser = await this.userRepository.save(user);
    console.log("✅ 저장된 유저 정보:", savedUser);

    return this.findOne(id);
  }

  async deleteProfileImage(userId: number): Promise<void> {
    const user = await this.findOne(userId);
    if (user.profile_img) {
      const filePath = join(
        __dirname,
        "..",
        "..",
        "uploads",
        "profiles",
        user.profile_img
      );
      try {
        await unlink(filePath);
      } catch (err) {
        this.logger.warn(`프로필 이미지 파일 삭제 실패: ${filePath}`);
      }
      user.profile_img = null;
      await this.userRepository.save(user);
    }
  }

  // 일반 유저가 직접 탈퇴
  async remove(userId: number, requestUser: User): Promise<void> {
    if (userId !== requestUser.id) {
      throw new ForbiddenException("본인 계정만 탈퇴할 수 있습니다.");
    }
    await this.deleteUserAndRelatedData(userId);
  }

  // [작성] 전화번호로 유저 조회
  async findByPhone(phone: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { phone },
    });
  }

  // 이메일찾기
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // 비밀번호 저장
  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  // ✅ ID로 유저 정보 조회 (이메일, 닉네임 변경 시 활용)
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async removeByEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다.");
    }
    await this.userRepository.remove(user);
  }

  // ✅ 프로필 이미지 변경
  async updateProfileImage(userId: number, filename: string): Promise<void> {
    const user = await this.findOne(userId);
    user.profile_img = filename;
    await this.userRepository.save(user);
  }

  // 유저 삭제 (배열)
  async removeMultiple(ids: number[]): Promise<void> {
    await this.userRepository.delete(ids);
  }

  // ✅ 관리자에 의한 유저 완전 삭제
  async deleteUsersByAdmin(userIds: number[]): Promise<void> {
    for (const userId of userIds) {
      await this.deleteUserAndRelatedData(userId);
    }
  }

  // ✅ 유저 및 관련 데이터 삭제 (포인트 등) - 공통 로직
  private async deleteUserAndRelatedData(userId: number): Promise<void> {
    // 1. 포인트 정보 삭제
    const where: FindOptionsWhere<Point> = { user: { id: userId } };
    await this.pointRepository.delete(where);

    // 2. 유저 정보 삭제
    const deleteResult = await this.userRepository.delete(userId);

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
}
