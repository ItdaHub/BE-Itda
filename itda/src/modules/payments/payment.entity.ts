import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "enum", enum: ["toss"] })
  method: string;

  @Column({
    type: "enum",
    enum: ["pending", "completed", "failed", "refunded"],
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
