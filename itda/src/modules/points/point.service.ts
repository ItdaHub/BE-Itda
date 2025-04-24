import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Point, PointType } from "./point.entity";
import { User } from "../users/user.entity";
import { Purchase } from "./purchases.entity";
import { UsePopcornDto } from "./dto/usepopcorn.dto";

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
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

  // ✅ 팝콘 사용
  async spendPoints(usePopcornDto: UsePopcornDto): Promise<any> {
    const { userId, novelId, chapterId, amount, description } = usePopcornDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다");
    }

    // ✅ 1. 포인트 차감
    await this.pointRepository.save({
      user,
      amount: -amount,
      type: PointType.SPEND,
      description,
    });

    // ✅ 2. novelId, chapterId가 있다면 purchase 테이블에 기록
    if (novelId && chapterId) {
      const existing = await this.purchaseRepository.findOne({
        where: {
          user: { id: userId },
          novelId,
          chapterId,
        },
      });

      if (!existing) {
        await this.purchaseRepository.save({
          user: { id: userId },
          novelId,
          chapterId,
        });
      }
    }

    return { success: true };
  }

  // ✅ 유료 여부 확인 (정확하게 chapterId까지 비교)
  async hasPurchased(
    userId: number,
    novelId: number,
    chapterId: number
  ): Promise<boolean> {
    const existing = await this.purchaseRepository
      .createQueryBuilder("purchase")
      .where("purchase.userId = :userId", { userId })
      .andWhere("purchase.novelId = :novelId", { novelId })
      .andWhere("purchase.chapterId = :chapterId", { chapterId })
      .getOne();

    return !!existing;
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

  // ✅ 구매한 회차 내역 반환
  async getPurchasedChapters(userId: number, novelId: number) {
    return this.purchaseRepository.find({
      where: {
        user: { id: userId },
        novelId,
      },
      select: ["chapterId"], // 필요한 필드만 반환
    });
  }
}
