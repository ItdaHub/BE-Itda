import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Novel } from "./novel.entity";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { Genre } from "../genre/genre.entity";
import { User } from "../users/user.entity";
import { Chapter } from "../chapter/chapter.entity";
import { Participant } from "./participant.entity";
import { AgeGroup } from "./dto/filternovel.dto";

@Injectable()
export class NovelService {
  constructor(
    @InjectRepository(Novel)
    private readonly novelRepo: Repository<Novel>,

    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,

    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>
  ) {}

  async getAllNovels(): Promise<Novel[]> {
    return this.novelRepo.find({ relations: ["genre", "creator", "chapters"] });
  }

  async getNovelById(id: number): Promise<Novel> {
    const novel = await this.novelRepo.findOne({
      where: { id },
      relations: ["chapters", "creator", "genre"],
    });

    if (!novel) {
      throw new NotFoundException("해당 소설이 존재하지 않습니다.");
    }

    return novel;
  }

  async create(dto: CreateNovelDto): Promise<Novel> {
    const { title, categoryId, peopleNum, content, userId, type } = dto;

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new Error("작성자 유저를 찾을 수 없습니다");

    const genre = await this.genreRepo.findOneBy({ id: categoryId });
    if (!genre) throw new Error("해당 장르가 존재하지 않습니다");

    const maxParticipants = peopleNum;

    const novel = this.novelRepo.create({
      title,
      creator: user,
      genre,
      max_participants: maxParticipants as 5 | 7 | 9,
      status: "ongoing",
      type,
    });
    await this.novelRepo.save(novel);

    const chapter = this.chapterRepo.create({
      novel,
      author: user,
      content,
      chapter_number: 1,
    });
    await this.chapterRepo.save(chapter);

    const participant = this.participantRepo.create({
      novel,
      user,
      order_number: 1,
    });
    await this.participantRepo.save(participant);

    return novel;
  }

  async addChapter(novelId: number, dto: AddChapterDto): Promise<Chapter> {
    const { userId, content } = dto;

    const novel = await this.novelRepo.findOne({
      where: { id: novelId },
      relations: ["chapters"],
    });
    if (!novel) throw new NotFoundException("해당 소설이 존재하지 않습니다.");

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("작성자를 찾을 수 없습니다.");

    const hasUserWrittenBefore = novel.chapters.some(
      (chapter) => chapter.author.id === userId
    );
    if (hasUserWrittenBefore) {
      throw new BadRequestException(
        "해당 사용자는 이미 이 소설에 작성한 적이 있습니다."
      );
    }

    const lastChapter = novel.chapters[novel.chapters.length - 1];
    if (lastChapter?.author?.id === userId) {
      throw new BadRequestException(
        "바로 앞 차례에 글을 쓴 사용자는 연속으로 작성할 수 없습니다."
      );
    }

    const currentParticipantCount = await this.participantRepo.count({
      where: { novel: { id: novelId } },
    });

    if (currentParticipantCount >= novel.max_participants) {
      throw new BadRequestException("참여자 수를 초과했습니다.");
    }

    const newParticipant = this.participantRepo.create({
      novel,
      user,
      order_number: currentParticipantCount + 1,
    });
    await this.participantRepo.save(newParticipant);

    const chapter = this.chapterRepo.create({
      novel,
      author: user,
      content,
      chapter_number: novel.chapters.length + 1,
    });

    return this.chapterRepo.save(chapter);
  }

  async getParticipants(novelId: number): Promise<Participant[]> {
    const participants = await this.participantRepo.find({
      where: { novel: { id: novelId } },
      relations: ["user"],
      order: { order_number: "ASC" },
    });

    return participants;
  }

  async getFilteredNovels(
    type?: string,
    genre?: string | number,
    age?: number
  ) {
    const query = this.novelRepo
      .createQueryBuilder("novel")
      .leftJoinAndSelect("novel.creator", "user")
      .leftJoinAndSelect("novel.genre", "genre")
      .leftJoinAndSelect("novel.chapters", "chapter")
      .leftJoinAndSelect("novel.likes", "likes")
      .loadRelationCountAndMap("novel.likeCount", "novel.likes");

    console.log("필터링 조건:", { type, genre, age });

    if (type === "first") {
      query.andWhere("chapter.chapter_number = 1");
    }

    if (genre !== undefined && genre !== "all" && genre !== "전체") {
      if (typeof genre === "number" || !isNaN(Number(genre))) {
        query.andWhere("genre.id = :genreId", { genreId: Number(genre) });
      } else {
        query.andWhere("genre.name = :genreName", { genreName: genre });
      }
    }

    if (age !== undefined) {
      query.andWhere("user.age_group = :age", { age });
    }

    query.orderBy("novel.created_at", "DESC");

    return await query.getMany();
  }

  async getNovelDetail(novelId: number, userId?: number): Promise<any> {
    const novel = await this.novelRepo.findOne({
      where: { id: novelId },
      relations: [
        "creator",
        "genre",
        "likes",
        "likes.user",
        "participants",
        "participants.user",
        "chapters",
      ],
    });

    if (!novel) throw new NotFoundException("소설을 찾을 수 없습니다.");

    const likeCount = novel.likes.length;
    const isLiked = userId
      ? novel.likes.some((like) => like.user.id === userId)
      : false;

    return {
      id: novel.id,
      title: novel.title,
      genre: novel.genre?.name ?? null,
      categoryId: novel.genre?.id ?? null,
      author: novel.participants
        .filter((p) => p.user && p.user.nickname)
        .map((p) => p.user.nickname)
        .join(", "),
      likeCount,
      isLiked,
      image: novel.cover_image,
      type: novel.type,
      createdAt: novel.created_at.toISOString(),
    };
  }

  async findMyNovels(userId: number) {
    return this.novelRepo.find({
      where: { creator: { id: userId } },
      relations: ["creator"],
      order: { created_at: "DESC" },
    });
  }

  async searchNovelsByTitle(query: string): Promise<Novel[]> {
    return this.novelRepo.find({
      where: { title: Like(`%${query}%`) },
      relations: ["genre", "creator", "chapters"],
      order: { created_at: "DESC" },
    });
  }

  async getRankedNovels(): Promise<Novel[]> {
    const novels = await this.novelRepo.find({
      relations: ["likes", "creator", "genre", "chapters"],
    });

    const ranked = novels
      .map((novel) => {
        const score =
          (novel.likes?.length || 0) * 0.7 + (novel.viewCount || 0) * 0.3;
        return { ...novel, score };
      })
      .sort((a, b) => {
        if (b.score === a.score) {
          return a.title.localeCompare(b.title);
        }
        return b.score - a.score;
      })
      .slice(0, 8);

    return ranked;
  }

  async getRankedNovelsByAge(ageGroup: number): Promise<Novel[]> {
    const novels = await this.novelRepo.find({
      relations: ["likes", "creator", "genre", "chapters"],
      where: {
        creator: {
          age_group: ageGroup,
        },
      },
    });

    const ranked = novels
      .map((novel) => {
        const score =
          (novel.likes?.length || 0) * 0.7 + (novel.viewCount || 0) * 0.3;
        return { ...novel, score };
      })
      .sort((a, b) => {
        if (b.score === a.score) {
          return a.title.localeCompare(b.title);
        }
        return b.score - a.score;
      })
      .slice(0, 8);

    return ranked;
  }
}
