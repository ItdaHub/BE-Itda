import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { Point } from "../points/point.entity";
import { FindOptionsWhere } from "typeorm";
import { CreateUserDto } from "./dto/ceateuser.dto";

@Injectable()
export class UserService {
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
    const user = this.userRepository.create(userDto);
    return this.userRepository.save(user);
  }

  // // 유저 업데이트
  // async update(id: number, user: Partial<User>): Promise<User> {
  //   const { password, nickname, phone, profile_img } = user;

  //   const updateData: Partial<User> = {};
  //   if (password) updateData.password = password;
  //   if (nickname) updateData.nickname = nickname;
  //   if (phone) updateData.phone = phone;
  //   if (profile_img) updateData.profile_img = profile_img;

  //   await this.userRepository.update(id, updateData);
  //   return this.findOne(id);
  // }
  // 유저 업데이트
  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // userData에 있는 모든 필드를 user 엔티티에 병합합니다.
    Object.assign(user, userData);

    await this.userRepository.save(user);
    return this.findOne(id);
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
    await this.userRepository.delete(ids); // TypeORM에서는 배열로 한 번에 삭제 가능
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
    const where: FindOptionsWhere<Point> = { user: { id: userId } }; // FindOptionsWhere를 사용하여 조건 설정
    await this.pointRepository.delete(where);

    // 2. 유저 정보 삭제
    const deleteResult = await this.userRepository.delete(userId);

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    // 추가적으로 다른 연관된 데이터 삭제 로직이 있다면 여기에 추가합니다.
  }
}
