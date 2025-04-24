import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../users/user.entity";

export enum PointType {
  EARN = "earn",
  SPEND = "spend",
}

// 포인트 테이블
@Entity("points")
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.points)
  user: User;

  @Column({ type: "int" })
  amount: number;

  @Column({ type: "enum", enum: PointType })
  type: PointType;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string;
}
