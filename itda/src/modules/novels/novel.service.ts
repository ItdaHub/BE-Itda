import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Like, In } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Novel } from "./novel.entity";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { Genre } from "../genre/genre.entity";
import { User } from "../users/user.entity";
import { Chapter } from "../chapter/chapter.entity";
import { Participant } from "./participant.entity";
import { NovelStatus } from "./novel.entity";

type CreateNovelInput = CreateNovelDto & { userId: number };

@Injectable()
export class NovelService {
  constructor(
    @InjectRepository(Novel) private readonly novelRepo: Repository<Novel>,
    @InjectRepository(Genre) private readonly genreRepo: Repository<Genre>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>
  ) {}

  async getAllNovels(): Promise<Novel[]> {
    return this.novelRepo.find({ relations: ["genre", "creator", "chapters"] });
  }

  async getPublishedNovels(): Promise<Novel[]> {
    return this.novelRepo.find({
      where: { isPublished: true },
      relations: ["genre", "creator", "chapters"],
    });
  }

  async getNovelById(id: number): Promise<any> {
    const novel = await this.novelRepo.findOne({
      where: { id },
      relations: ["chapters", "creator", "genre"],
    });
    if (!novel) throw new NotFoundException("해당 소설이 존재하지 않습니다.");

    const nextChapterNumber = novel.chapters.length + 1;

    return {
      ...novel,
      nextChapterNumber,
    };
  }

  async create(dto: CreateNovelInput): Promise<Novel> {
    const { title, categoryId, peopleNum, content, userId, type } = dto;

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("작성자 유저를 찾을 수 없습니다.");

    const genre = await this.genreRepo.findOneBy({ id: categoryId });
    if (!genre) throw new NotFoundException("해당 장르가 존재하지 않습니다.");

    const novel = this.novelRepo.create({
      title,
      creator: user,
      genre,
      max_participants: peopleNum as 5 | 7 | 9,
      status: NovelStatus.ONGOING,
      type,
    } as Partial<Novel>);

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

  async addChapter(novelId: number, dto: AddChapterDto): Promise<any> {
    const { userId, content } = dto;

    const novel = await this.novelRepo.findOne({ where: { id: novelId } });
    if (!novel) throw new NotFoundException("해당 소설이 존재하지 않습니다.");

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("작성자를 찾을 수 없습니다.");

    const existingChapters = await this.chapterRepo.find({
      where: { novel: { id: novelId } },
      order: { chapter_number: "ASC" },
      relations: ["author"],
    });

    const hasWritten = existingChapters.some(
      (chapter) => chapter.author.id === userId
    );
    if (hasWritten) {
      throw new BadRequestException(
        "해당 사용자는 이미 이 소설에 작성한 적이 있습니다."
      );
    }

    const lastChapter = existingChapters[existingChapters.length - 1];
    if (lastChapter?.author?.id === userId) {
      throw new BadRequestException("연속으로 작성할 수 없습니다.");
    }

    const participantCount = await this.participantRepo.count({
      where: { novel: { id: novelId } },
    });

    if (participantCount >= novel.max_participants) {
      throw new BadRequestException("참여자 수를 초과했습니다.");
    }

    // 참가자 추가
    const participant = this.participantRepo.create({
      novel,
      user,
      order_number: participantCount + 1,
    });
    await this.participantRepo.save(participant);

    const chapterNumber =
      existingChapters.length > 0 ? existingChapters.length + 1 : 1;

    // 새로운 챕터 추가
    const chapter = this.chapterRepo.create({
      novel,
      author: user,
      content,
      chapter_number: chapterNumber,
    });
    const savedChapter = await this.chapterRepo.save(chapter);

    // 새로운 참가자 수를 확인
    const newParticipantCount = await this.participantRepo.count({
      where: { novel: { id: novelId } },
    });

    // 참여자 수가 max_participants와 같으면 소설 상태를 completed로 변경
    if (newParticipantCount >= novel.max_participants) {
      console.log("참여자 수가 max_participants와 같거나 큽니다.", {
        newParticipantCount,
        maxParticipants: novel.max_participants,
      });

      // 상태 변경 전 확인 로그
      console.log(`상태 변경 전 소설 상태: ${novel.status}`);

      novel.status = NovelStatus.COMPLETED;

      // 상태 변경 후 확인 로그
      console.log("소설 상태를 completed로 변경:", novel.status);

      await this.novelRepo.save(novel);

      // 상태 변경 완료 로그
      console.log("상태 변경이 완료되었습니다.");
    }

    return {
      chapter: savedChapter,
      peopleNum: novel.max_participants,
      currentPeople: newParticipantCount,
      status: novel.status,
    };
  }

  async getChapters(novelId: number): Promise<any[]> {
    const chapters = await this.chapterRepo.find({
      where: { novel: { id: novelId } },
      order: { chapter_number: "ASC" },
      relations: ["author"],
    });

    return chapters.map((chapter) => ({
      id: chapter.id,
      chapterNumber: chapter.chapter_number,
      content: chapter.content,
      createdAt: chapter.created_at,
      authorId: chapter.author?.id,
      authorNickname: chapter.author?.nickname ?? null,
    }));
  }

  async getParticipants(novelId: number): Promise<Participant[]> {
    return this.participantRepo.find({
      where: { novel: { id: novelId } },
      relations: ["user"],
      order: { order_number: "ASC" },
    });
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
      .leftJoinAndSelect("novel.likes", "likes")
      .loadRelationCountAndMap("novel.likeCount", "novel.likes");

    if (type === "new") {
      query
        .leftJoin("novel.chapters", "chapter_new")
        .andWhere("chapter_new.chapter_number = 1");
    } else if (type === "relay") {
      query.andWhere("novel.type = :type", { type });
    }

    if (typeof genre === "string" && genre !== "all" && genre !== "전체") {
      const foundGenre = await this.genreRepo.findOne({
        where: { value: genre },
      });
      if (foundGenre) {
        query.andWhere("genre.id = :genreId", { genreId: foundGenre.id });
      } else {
        throw new NotFoundException(`장르 '${genre}'를 찾을 수 없습니다.`);
      }
    } else if (!isNaN(Number(genre))) {
      const genreId = Number(genre);
      query.andWhere("genre.id = :genreId", { genreId });
    }

    if (age !== undefined) {
      query.andWhere("user.age_group = :age", { age });
    }

    const results = await query.orderBy("novel.created_at", "DESC").getMany();

    return results.map((novel) => ({
      id: novel.id,
      title: novel.title,
      genre: novel.genre?.name ?? null,
      imageUrl: novel.cover_image,
      likes: novel.likeCount ?? novel.likes?.length ?? 0,
      views: novel.viewCount ?? 0,
      created_at: novel.created_at,
    }));
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

    novel.viewCount += 1;
    await this.novelRepo.save(novel);

    const likeCount = novel.likes.length;
    const isLiked = userId
      ? novel.likes.some((like) => like.user.id === userId)
      : false;

    const sortedChapters = [...novel.chapters].sort(
      (a, b) => a.chapter_number - b.chapter_number
    );

    return {
      id: novel.id,
      title: novel.title,
      genre: novel.genre?.name ?? null,
      categoryId: novel.genre?.id ?? null,
      author: novel.participants
        .filter((p) => p.user?.nickname)
        .map((p) => p.user.nickname)
        .join(", "),
      likeCount,
      isLiked,
      image: novel.cover_image,
      type: novel.type,
      createdAt: novel.created_at.toISOString(),
      peopleNum: novel.max_participants,
      chapters: novel.chapters
        .sort((a, b) => a.chapter_number - b.chapter_number)
        .map((chapter) => ({
          id: chapter.id,
          content: chapter.content,
          chapterNumber: chapter.chapter_number,
          authorId: chapter.author?.id,
        })),
      nextChapterNumber: sortedChapters.length + 1, // 👉 추가된 부분
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

    return novels
      .map((novel) => ({
        ...novel,
        score: (novel.likes?.length || 0) * 0.7 + (novel.viewCount || 0) * 0.3,
      }))
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 10);
  }

  async getRankedNovelsByAge(ageGroup: number): Promise<Novel[]> {
    const novels = await this.novelRepo.find({
      where: { creator: { age_group: ageGroup } },
      relations: ["likes", "creator", "genre", "chapters"],
    });

    return novels
      .map((novel) => ({
        ...novel,
        score: (novel.likes?.length || 0) * 0.7 + (novel.viewCount || 0) * 0.3,
      }))
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 10);
  }

  async submitNovelForCompletion(novelId: number): Promise<Novel> {
    console.log("출품 요청된 소설 ID:", novelId);

    const novel = await this.novelRepo.findOneBy({ id: novelId });
    console.log("조회된 소설:", novel);

    if (!novel) {
      throw new NotFoundException(`소설 ID ${novelId}를 찾을 수 없습니다.`);
    }

    if (novel.status === "completed") {
      console.log("이미 완료된 소설입니다.");
      throw new BadRequestException("이미 완료된 소설입니다.");
    }

    novel.status = NovelStatus.SUBMITTED;
    console.log("소설 상태를 SUBMITTED로 변경");
    return await this.novelRepo.save(novel);
  }

  async getCompletedNovels() {
    const novels = await this.novelRepo.find({
      where: { status: In(["submitted", "completed"]) }, // ✅ 수정됨
      relations: ["creator"],
      order: { created_at: "DESC" },
    });

    return novels.map((novel) => ({
      id: novel.id,
      title: novel.title,
      writer: novel.creator?.name || "알 수 없음",
      date: novel.created_at.toISOString().split("T")[0],
      status: novel.status,
    }));
  }

  async adminDeleteNovel(novelId: number) {
    const novel = await this.novelRepo.findOne({ where: { id: novelId } });
    if (!novel) throw new NotFoundException("소설을 찾을 수 없습니다.");
    return this.novelRepo.remove(novel);
  }

  async adminPublishNovel(novelId: number) {
    const novel = await this.novelRepo.findOne({ where: { id: novelId } });
    if (!novel) throw new NotFoundException("소설을 찾을 수 없습니다.");
    novel.isPublished = true;
    return this.novelRepo.save(novel);
  }
}
