import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentsService } from "./payment.service";
import { PaymentsController } from "./payment.controller";
import { Payment } from "./payment.entity";
import { User } from "../users/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
