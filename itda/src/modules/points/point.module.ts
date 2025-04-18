import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Point } from "./point.entity";
import { PointService } from "./point.service";
import { PointController } from "./point.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  providers: [PointService],
  controllers: [PointController],
  exports: [PointService, TypeOrmModule.forFeature([Point])], // PointRepository 제거
})
export class PointModule {}
