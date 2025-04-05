import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WritersController } from "./writers.controller";
import { WritersService } from "./writers.service";
import { Chapter } from "../chapter/chapter.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Chapter])],
  controllers: [WritersController],
  providers: [WritersService],
})
export class WritersModule {}
