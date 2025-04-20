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
import { NotificationService } from "../notifications/notification.service";

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
    private readonly participantRepo: Repository<Participant>,
    private readonly notificationService: NotificationService
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

    // ✅ 상태 체크 및 변경
    await this.checkAndUpdateNovelStatus(novelId);

    return {
      chapter: savedChapter,
      peopleNum: novel.max_participants,
      currentPeople: newParticipantCount,
      status: novel.status,
    };
  }

  async checkAndUpdateNovelStatus(novelId: number): Promise<void> {
    const novel = await this.novelRepo.findOne({
      where: { id: novelId },
      relations: ["chapters"],
    });

    if (!novel) {
      throw new NotFoundException(`Novel with ID ${novelId} not found`);
    }

    const chapterCount = novel.chapters.length;

    if (
      chapterCount >= novel.max_participants &&
      novel.status !== NovelStatus.COMPLETED
    ) {
      novel.status = NovelStatus.COMPLETED;
      await this.novelRepo.save(novel);
    }
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
      .loadRelationCountAndMap("novel.likeCount", "novel.likes")
      .where("novel.status != :submitted", {
        submitted: NovelStatus.SUBMITTED,
      });

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
        "chapters.author",
        "chapters.reports",
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

    // 전체 챕터 수의 2/3을 계산
    const totalChapters = sortedChapters.length;
    const paidChapterCount = Math.floor((totalChapters * 2) / 3);

    // 2/3 이후 부분을 유료로 설정
    sortedChapters.forEach((chapter, index) => {
      if (index >= paidChapterCount) {
        chapter.isPaid = true; // 유료
        console.log(
          `Chapter ${chapter.chapter_number} is set to paid: ${chapter.isPaid}`
        );
      } else {
        chapter.isPaid = false; // 무료
        console.log(
          `Chapter ${chapter.chapter_number} is set to free: ${chapter.isPaid}`
        );
      }
    });

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
      chapters: sortedChapters.map((chapter) => ({
        id: chapter.id,
        content: chapter.content,
        chapterNumber: chapter.chapter_number,
        authorId: chapter.author?.id,
        authorNickname: chapter.author?.nickname ?? null,
        reportCount: chapter.reports?.length ?? 0,
        isPaid: chapter.isPaid,
      })),
      nextChapterNumber: sortedChapters.length + 1,
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
    console.log("소설 완료 요청 ID:", novelId);

    const novel = await this.novelRepo.findOneBy({ id: novelId });
    if (!novel) {
      throw new NotFoundException(`소설 ID ${novelId}를 찾을 수 없습니다.`);
    }

    // 이미 완료 상태거나 출품된 경우는 그대로 둔다
    if (
      novel.status === NovelStatus.COMPLETED ||
      novel.status === NovelStatus.SUBMITTED
    ) {
      return novel;
    }

    // 완료 상태로 변경
    novel.status = NovelStatus.COMPLETED;
    console.log("소설 상태를 COMPLETED로 변경");

    return await this.novelRepo.save(novel);
  }

  async getCompletedNovels() {
    const novels = await this.novelRepo.find({
      where: { status: In(["submitted", "completed"]) },
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
    const novel = await this.novelRepo.findOne({
      where: { id: novelId },
      relations: ["creator", "chapters", "chapters.author"], // author 포함해서 불러오기!
    });

    if (!novel) throw new NotFoundException("소설을 찾을 수 없습니다.");

    // 출품 상태로 변경
    novel.status = NovelStatus.SUBMITTED;
    novel.isPublished = true;

    await this.novelRepo.save(novel);

    // 유료 회차 전환: 뒤쪽 2/3 유료로 설정
    const chapters = novel.chapters.sort(
      (a, b) => Number(a.chapter_number) - Number(b.chapter_number)
    );

    const total = chapters.length;
    const freeLimit = Math.floor(total / 3);

    for (let i = 0; i < total; i++) {
      chapters[i].isPaid = i >= freeLimit;
    }

    await this.chapterRepo.save(chapters);

    // ✅ 참여자 추출 (중복 제거)
    const participantMap = new Map<number, User>();
    for (const chapter of chapters) {
      if (chapter.author && !participantMap.has(chapter.author.id)) {
        participantMap.set(chapter.author.id, chapter.author);
      }
    }

    // ✅ 알림 전송
    for (const user of participantMap.values()) {
      await this.notificationService.sendNotification({
        user,
        content: `당신이 참여한 소설 "${novel.title}"이 출품되었습니다!`,
        novel,
        type: "NOVEL_SUBMIT",
      });
    }

    console.log("✅ 출품 완료 및 알림 전송 완료:", novel.title);

    return novel;
  }

  async getWaitingNovelsForSubmission() {
    const novels = await this.novelRepo.find({
      where: { status: NovelStatus.COMPLETED },
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
}
