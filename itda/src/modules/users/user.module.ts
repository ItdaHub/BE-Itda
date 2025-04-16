import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      // MulterModule 동적 등록
      imports: [ConfigModule],
      useFactory: async () => ({
        dest: "./uploads/profiles",
      }),
      inject: [],
    }),
    ConfigModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
