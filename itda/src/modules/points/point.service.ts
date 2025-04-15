import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Point, PointType } from "./point.entity"; // ✅ PointType import
import { User } from "../users/user.entity";

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>
  ) {}

  async getUserTotalPoints(userId: number): Promise<number> {
    console.log("요청받은 userId:", userId); // ✅ 콘솔 추가

    const result = await this.pointRepository
      .createQueryBuilder("point")
      .select("SUM(point.amount)", "total")
      .where("point.user.id = :userId", { userId })
      .getRawOne();

    console.log("SUM 쿼리 결과:", result); // ✅ 콘솔 추가

    return Number(result.total) || 0;
  }

  async addPoint(
    user: User,
    amount: number,
    type: PointType // ✅ enum 타입으로 명시
  ): Promise<Point> {
    const point = this.pointRepository.create({
      user,
      amount,
      type,
    });
    return await this.pointRepository.save(point);
  }
}
