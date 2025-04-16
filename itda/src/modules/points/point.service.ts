import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Point, PointType } from "./point.entity";
import { User } from "../users/user.entity";

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>
  ) {}

  async getUserTotalPoints(userId: number): Promise<number> {
    console.log("요청받은 userId:", userId);

    const result = await this.pointRepository
      .createQueryBuilder("point")
      .select("SUM(point.amount)", "total")
      .where("point.user.id = :userId", { userId })
      .getRawOne();

    console.log("SUM 쿼리 결과:", result);

    return Number(result.total) || 0;
  }

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

  // point.service.ts
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
