import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Point } from "./entities/point.entity";
import { PointService } from "./point.service";
import { PointController } from "./point.controller";
import { UserModule } from "../users/user.module";
import { Purchase } from "./entities/purchases.entity";
import { User } from "../users/entities/user.entity";
import { Novel } from "../novels/entities/novel.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Point, Purchase, User, Novel]),
    forwardRef(() => UserModule),
  ],
  providers: [PointService],
  controllers: [PointController],
  exports: [PointService, TypeOrmModule.forFeature([Point])],
})
export class PointModule {}
