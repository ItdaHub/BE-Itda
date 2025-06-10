import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "src/modules/users/entities/user.entity";

// 유료 결제 내역 테이블
@Entity("purchases")
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;

  @Column({ type: "int" })
  novelId: number;

  @Column({ type: "int" })
  chapterId: number;

  @CreateDateColumn()
  created_at: Date;
}
