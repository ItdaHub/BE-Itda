import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Novel } from "./novel.entity";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Novel, (novel) => novel.tags)
  novels: Novel[];
}
