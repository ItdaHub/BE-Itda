import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Novel } from "./novel.entity";
import { Chapter } from "src/modules/chapter/entities/chapter.entity";

@Entity("ai_generated_images")
export class AIGeneratedImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Novel, (novel) => novel.id)
  novel: Novel;

  @ManyToOne(() => Chapter, { nullable: true, onDelete: "SET NULL" })
  chapter: Chapter | null;

  @Column({ length: 255 })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;
}
