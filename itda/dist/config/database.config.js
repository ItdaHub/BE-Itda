"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.DatabaseConfig = {
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
//# sourceMappingURL=database.config.js.map