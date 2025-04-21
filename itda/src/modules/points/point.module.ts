import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Point } from "./point.entity";
import { PointService } from "./point.service";
import { PointController } from "./point.controller";
import { UserModule } from "../users/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Point]), forwardRef(() => UserModule)],
  providers: [PointService],
  controllers: [PointController],
  exports: [PointService, TypeOrmModule.forFeature([Point])],
})
export class PointModule {}
