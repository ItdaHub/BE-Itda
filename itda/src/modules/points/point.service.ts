import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Point, PointType } from "./point.entity";
import { User } from "../users/user.entity";

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  // ✅ 유저 총 팝콘 조회 (적립 - 사용)
  async getUserTotalPoints(userId: number): Promise<number> {
    const result = await this.pointRepository
      .createQueryBuilder("point")
      .select("SUM(point.amount)", "total")
      .where("point.user.id = :userId", { userId })
      .getRawOne();

    return Number(result.total) || 0;
  }

  // ✅ 팝콘 사용 (단일 메서드로 통합)
  async spendPoints(dto: {
    userId: number;
    amount: number;
    description?: string;
    novelId?: number;
    chapterId?: number;
  }): Promise<Point> {
    const { userId, amount, description } = dto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    const total = await this.getUserTotalPoints(userId);
    if (total < amount) throw new BadRequestException("Not enough popcorn");

    const point = this.pointRepository.create({
      user,
      amount: -amount,
      type: PointType.SPEND,
      description: description || "팝콘 사용",
    });

    return await this.pointRepository.save(point);
  }

  // ✅ 팝콘 적립
  async addPoint(
    user: User,
    amount: number,
    type: PointType,
    description?: string
  ): Promise<Point> {
    const point = this.pointRepository.create({
      user,
      amount,
      type,
      description,
    });
    return await this.pointRepository.save(point);
  }

  // ✅ 팝콘 사용/적립 내역 조회
  async getUserHistory(
    userId: number,
    type: PointType
  ): Promise<{ title?: string; amount: number; date: string }[]> {
    const result = await this.pointRepository.find({
      where: {
        user: { id: userId },
        type,
      },
      order: {
        created_at: "DESC",
      },
      select: {
        amount: true,
        created_at: true,
        description: true,
      },
    });

    return result.map((entry) => ({
      title:
        entry.description ||
        (type === PointType.EARN ? "팝콘 충전" : "팝콘 사용"),
      amount: entry.amount,
      date: entry.created_at.toISOString().slice(0, 19).replace("T", " "),
    }));
  }
}
