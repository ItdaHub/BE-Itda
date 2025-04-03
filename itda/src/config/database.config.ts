import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const DatabaseConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT ?? "3306", 10),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "my_database",
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  synchronize: process.env.DB_SYNC === "true",
  logging: process.env.DB_LOGGING === "true",
};
