import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentsService } from "./payment.service";
import { PaymentsController } from "./payment.controller";
import { Payment } from "./entities/payment.entity";
import { User } from "../users/entities/user.entity";
import { PointModule } from "../points/point.module";

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User]), PointModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
