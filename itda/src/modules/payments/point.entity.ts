import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity("points")
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.points)
  user: User;

  @Column({ type: "int" })
  amount: number;

  @Column({ type: "enum", enum: ["earn", "spend"] })
  type: string;

  @CreateDateColumn()
  created_at: Date;
}
