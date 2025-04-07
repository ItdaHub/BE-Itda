import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Novel } from "../novels/novel.entity";

@Entity("genres")
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 50, unique: true })
  value: string;

  @OneToMany(() => Novel, (novel) => novel.genre)
  novels: Novel[];
}
