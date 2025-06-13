import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { Like, In, Not, IsNull } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Novel } from "./entities/novel.entity";
import { CreateNovelDto } from "./dto/createnovel.dto";
import { AddChapterDto } from "./dto/addchapter.dto";
import { Genre } from "../genre/entities/genre.entity";
import { User } from "../users/entities/user.entity";
import { Chapter } from "../chapter/entities/chapter.entity";
import { Participant } from "./entities/participant.entity";
import { NovelStatus } from "./entities/novel.entity";
import { NotificationService } from "../notifications/notification.service";
import { AiService } from "../ai/ai.service";
import { Tag } from "./entities/tag.entity";

type CreateNovelInput = CreateNovelDto & { userId: number };

@Injectable()
export class NovelService {
  constructor(
    @InjectRepository(Novel)
    private readonly novelRepository: Repository<Novel>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    private readonly notificationService: NotificationService,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @Inject(forwardRef(() => AiService))
    private readonly aiService: AiService
  ) {}

  async getAllNovels(): Promise<Novel[]> {
    return this.novelRepository.find({
      relations: ["genre", "creator", "chapters"],
    });
  }

  async getPublishedNovels(): Promise<Novel[]> {
    return this.novelRepository.find({
      where: { isPublished: true },
      relations: ["genre", "creator", "chapters"],
    });
  }

  async getNovelById(id: number): Promise<any> {
    const novel = await this.novelRepository.findOne({
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
    const { content, categoryId, peopleNum, userId, type, title, tags } = dto;

    // 사용자 정보 확인
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("작성자 유저를 찾을 수 없습니다.");

    // 장르 정보 확인
    const genre = await this.genreRepository.findOneBy({ id: categoryId });
    if (!genre) throw new NotFoundException("해당 장르가 존재하지 않습니다.");

    // ✅ 태그 처리
    let tagEntities: Tag[] = [];
    if (tags && tags.length > 0) {
      tagEntities = await Promise.all(
        tags.map(async (tagName) => {
          const existing = await this.tagRepository.findOne({
            where: { name: tagName },
          });
          if (existing) return existing;
          return this.tagRepository.save(
            this.tagRepository.create({ name: tagName })
          );
        })
      );
    }

    // ✅ AI를 사용하여 요약 및 이미지 생성
    const summary = await this.aiService.summarizeText(content); // AI 요약
    const imageUrl = await this.aiService["getImageFromUnsplash"](summary); // 이미지 생성 (private이라면 메서드 래핑 추천)

    // 소설 정보 저장
    const novel = this.novelRepository.create({
      title,
      creator: user,
      genre,
      max_participants: peopleNum as 5 | 7 | 9,
      status: NovelStatus.ONGOING,
      type,
      imageUrl,
      tags: tagEntities,
    } as Partial<Novel>);

    await this.novelRepository.save(novel);

    // 첫 번째 챕터 저장
    const chapter = this.chapterRepository.create({
      novel,
      author: user,
      content,
      chapter_number: 1,
    });
    await this.chapterRepository.save(chapter);

    // 첫 번째 참가자 저장
    const participant = this.participantRepository.create({
      novel,
      user,
      order_number: 1,
    });
    await this.participantRepository.save(participant);

    return novel;
  }

  async addChapter(novelId: number, dto: AddChapterDto): Promise<any> {
    const { userId, content } = dto;

    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
    });
    if (!novel) throw new NotFoundException("해당 소설이 존재하지 않습니다.");

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("작성자를 찾을 수 없습니다.");

    const existingChapters = await this.chapterRepository.find({
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

    const participantCount = await this.participantRepository.count({
      where: { novel: { id: novelId } },
    });

    if (participantCount >= novel.max_participants) {
      throw new BadRequestException("참여자 수를 초과했습니다.");
    }

    // 참가자 추가
    const participant = this.participantRepository.create({
      novel,
      user,
      order_number: participantCount + 1,
    });
    await this.participantRepository.save(participant);

    const chapterNumber =
      existingChapters.length > 0 ? existingChapters.length + 1 : 1;

    // 새로운 챕터 추가
    const chapter = this.chapterRepository.create({
      novel,
      author: user,
      content,
      chapter_number: chapterNumber,
    });
    const savedChapter = await this.chapterRepository.save(chapter);

    // 새로운 참가자 수를 확인
    const newParticipantCount = await this.participantRepository.count({
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
    const novel = await this.novelRepository.findOne({
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
      await this.novelRepository.save(novel);
    }
  }

  async getChapters(novelId: number, userId?: number): Promise<any[]> {
    const novel = await this.novelRepository.findOne({
      select: ["id", "status"],
    });

    const chapters = await this.chapterRepository.find({
      where: { novel: { id: novelId } },
      order: { chapter_number: "ASC" },
      relations: ["author"],
    });

    const isFree = novel?.status !== NovelStatus.SUBMITTED;

    return chapters.map((chapter) => ({
      id: chapter.id,
      chapterNumber: chapter.chapter_number,
      content: isFree ? chapter.content : null,
      createdAt: chapter.created_at,
      authorId: chapter.author?.id,
      authorNickname: chapter.author?.nickname ?? null,
    }));
  }

  async getParticipants(novelId: number): Promise<Participant[]> {
    return this.participantRepository.find({
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
    const query = this.novelRepository
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
      const foundGenre = await this.genreRepository.findOne({
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
      imageUrl: novel.imageUrl,
      likes: novel.likeCount ?? novel.likes?.length ?? 0,
      views: novel.viewCount ?? 0,
      created_at: novel.created_at,
    }));
  }

  async getNovelDetail(novelId: number, userId?: number): Promise<any> {
    const novel = await this.novelRepository.findOne({
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
        "tags",
      ],
    });
    if (!novel) throw new NotFoundException("소설을 찾을 수 없습니다.");

    novel.viewCount += 1;
    await this.novelRepository.save(novel);

    const likeCount = novel.likes.length;
    const isLiked = userId
      ? novel.likes.some((like) => like.user.id === userId)
      : false;

    const sortedChapters = novel.chapters.sort(
      (a, b) => a.chapter_number - b.chapter_number
    );

    // 소설 1/3만 무료로 설정 → 출품된 소설에만 적용
    const isSubmitted = novel.status === NovelStatus.SUBMITTED;
    const freeCount = Math.floor(sortedChapters.length / 3);

    sortedChapters.forEach((chapter, index) => {
      chapter.isPaid = isSubmitted ? index >= freeCount : true;
    });

    sortedChapters.forEach((chapter, index) => {
      if (novel.status === NovelStatus.SUBMITTED) {
        chapter.isPaid = index >= freeCount; // 출품된 소설은 1/3만 무료
      } else {
        chapter.isPaid = true; // 출품되지 않은 소설은 전부 유료
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
      image: novel.imageUrl,
      type: novel.type,
      createdAt: novel.created_at.toISOString(),
      peopleNum: novel.max_participants,
      tags: novel.tags?.map((tag) => tag.name) ?? [],
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
      status: novel.status,
    };
  }

  async findMyNovels(userId: number) {
    const chapters = await this.chapterRepository.find({
      where: { author: { id: userId } },
      relations: ["novel", "novel.creator", "novel.genre"],
    });

    // 소설 중복 제거
    const novelsMap = new Map<number, Novel>();
    for (const chapter of chapters) {
      const novel = chapter.novel;
      if (novel.status === "ongoing" || novel.status === "submitted") {
        novelsMap.set(novel.id, novel);
      }
    }

    return Array.from(novelsMap.values()).sort(
      (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
    );
  }

  async searchNovelsByTitle(query: string): Promise<Novel[]> {
    return this.novelRepository.find({
      where: { title: Like(`%${query}%`) },
      relations: ["genre", "creator", "chapters"],
      order: { created_at: "DESC" },
    });
  }

  async getRankedNovels(): Promise<Novel[]> {
    const novels = await this.novelRepository.find({
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
    const novels = await this.novelRepository.find({
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

    const novel = await this.novelRepository.findOneBy({ id: novelId });
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

    return await this.novelRepository.save(novel);
  }

  async getCompletedNovels() {
    const novels = await this.novelRepository.find({
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
    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
    });
    if (!novel) throw new NotFoundException("소설을 찾을 수 없습니다.");
    return this.novelRepository.remove(novel);
  }

  async adminPublishNovel(novelId: number) {
    const novel = await this.novelRepository.findOne({
      where: { id: novelId },
      relations: ["creator", "chapters", "chapters.author"],
    });

    if (!novel) throw new NotFoundException("소설을 찾을 수 없습니다.");

    // 출품 상태로 변경
    novel.status = NovelStatus.SUBMITTED;
    novel.isPublished = true;

    await this.novelRepository.save(novel);

    // 유료 회차 전환: 뒤쪽 2/3 유료로 설정
    const chapters = novel.chapters.sort(
      (a, b) => Number(a.chapter_number) - Number(b.chapter_number)
    );

    const total = chapters.length;
    const freeLimit = Math.floor(total / 3);

    for (let i = 0; i < total; i++) {
      chapters[i].isPaid = i >= freeLimit;
    }

    await this.chapterRepository.save(chapters);

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
    const novels = await this.novelRepository.find({
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
