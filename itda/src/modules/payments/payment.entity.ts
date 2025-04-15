import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../users/user.entity";

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  TOSS = "toss",
  CARD = "card",
  PAYPAL = "paypal",
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: "CASCADE" })
  user: User;

  @Column({ nullable: true, unique: true })
  orderId: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "varchar", length: 30 })
  method: string;

  @Column({
    type: "enum",
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  created_at: Date;
}
