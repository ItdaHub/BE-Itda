import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
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
  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  // 유저 업데이트
  async update(id: number, user: Partial<User>): Promise<User> {
    const existingUser = await this.findOne(id);
    await this.userRepository.update(id, user);
    return existingUser;
  }

  // 유저 삭제
  async remove(id: number): Promise<void> {
    const existingUser = await this.findOne(id);
    await this.userRepository.delete(id);
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

  // ✅ 이메일, 닉네임 변경
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
