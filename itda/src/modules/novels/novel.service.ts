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

  /**
   * 전체 소설 목록 조회
   */
  async getAllNovels(): Promise<Novel[]> {
    return this.novelRepo.find({ relations: ["genre", "creator", "chapters"] });
  }

  /**
   * ID로 소설 상세 조회
   */
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

  /**
   * 소설 생성 + 첫 챕터 작성 + 참가자 등록
   */
  async create(dto: CreateNovelDto): Promise<Novel> {
    const { title, categoryId, peopleNum, content, userId } = dto;

    // 유저 검증
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new Error("작성자 유저를 찾을 수 없습니다");

    // 장르 검증
    const genre = await this.genreRepo.findOneBy({ id: categoryId });
    if (!genre) throw new Error("해당 장르가 존재하지 않습니다");

    // 인원 수
    const maxParticipants = peopleNum;

    // 소설 엔티티 생성 및 저장
    const novel = this.novelRepo.create({
      title,
      creator: user,
      genre,
      max_participants: maxParticipants,
      status: "ongoing", // 기본 상태는 '진행중'
    });
    await this.novelRepo.save(novel);

    // 첫 챕터 생성 및 저장
    const chapter = this.chapterRepo.create({
      novel,
      author: user,
      content,
      chapter_number: 1,
    });
    await this.chapterRepo.save(chapter);

    // 참가자 등록 (creator는 order_number = 1)
    const participant = this.participantRepo.create({
      novel,
      user,
      order_number: 1,
    });
    await this.participantRepo.save(participant);

    return novel;
  }

  /**
   * 이어쓰기 (새 챕터 작성) + 참가자 등록
   */
  async addChapter(novelId: number, dto: AddChapterDto): Promise<Chapter> {
    const { userId, content } = dto;

    // 소설 존재 여부 확인
    const novel = await this.novelRepo.findOne({
      where: { id: novelId },
      relations: ["chapters"],
    });
    if (!novel) throw new NotFoundException("해당 소설이 존재하지 않습니다.");

    // 작성자 유저 검증
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("작성자를 찾을 수 없습니다.");

    // 해당 사용자가 이미 작성했는지 확인
    const hasUserWrittenBefore = novel.chapters.some(
      (chapter) => chapter.author.id === userId
    );
    if (hasUserWrittenBefore) {
      throw new BadRequestException(
        "해당 사용자는 이미 이 소설에 작성한 적이 있습니다."
      );
    }

    // 바로 전 챕터 작성자가 본인인지 확인 (연속 작성 금지)
    const lastChapter = novel.chapters[novel.chapters.length - 1];
    if (lastChapter?.author?.id === userId) {
      throw new BadRequestException(
        "바로 앞 차례에 글을 쓴 사용자는 연속으로 작성할 수 없습니다."
      );
    }

    // 현재 참여자 수 확인
    const currentParticipantCount = await this.participantRepo.count({
      where: { novel: { id: novelId } },
    });

    // 인원 제한 초과 여부 체크
    if (currentParticipantCount >= novel.max_participants) {
      throw new BadRequestException("참여자 수를 초과했습니다.");
    }

    // 새 참가자 등록 (order_number는 현재 참여자 수 + 1)
    const newParticipant = this.participantRepo.create({
      novel,
      user,
      order_number: currentParticipantCount + 1,
    });
    await this.participantRepo.save(newParticipant);

    // 새 챕터 생성 및 저장
    const chapter = this.chapterRepo.create({
      novel,
      author: user,
      content,
      chapter_number: novel.chapters.length + 1,
    });

    return this.chapterRepo.save(chapter);
  }

  // ✅ 참여자 조회
  // 가공이 필요하다면 코드 작성해야함
  async getParticipants(novelId: number): Promise<Participant[]> {
    const participants = await this.participantRepo.find({
      where: { novel: { id: novelId } },
      relations: ["user"], // 유저 정보도 포함해서
      order: { order_number: "ASC" },
    });

    return participants;
  }

  // 타입 + 장르 + 연령 필터링
  async getFilteredNovels(
    type?: string,
    genre?: string,
    age?: string
  ): Promise<Novel[]> {
    const query = this.novelRepo
      .createQueryBuilder("novel")
      .leftJoinAndSelect("novel.genre", "genre")
      .leftJoinAndSelect("novel.creator", "creator")
      .leftJoinAndSelect("novel.chapters", "chapters")
      .orderBy("novel.id", "DESC");

    if (type) {
      query.andWhere("novel.type = :type", { type });
    }

    if (genre) {
      query.andWhere("genre.name = :genre", { genre });
    }

    if (age) {
      query.andWhere("novel.age = :age", { age });
    }

    return await query.getMany();
  }

  // 소설 상세조회
  async getNovelDetail(novelId: number, userId?: number): Promise<any> {
    const novel = await this.novelRepo.findOne({
      where: { id: novelId },
      relations: ["creator", "genre", "likes", "participants", "chapters"],
    });

    if (!novel) throw new NotFoundException("소설을 찾을 수 없습니다.");

    const likeCount = novel.likes.length;
    const isLiked = userId
      ? novel.likes.some((like) => like.user.id === userId)
      : false;

    return {
      id: novel.id,
      title: novel.title,
      genre: novel.genre.name,
      author: novel.participants.map((p) => p.user.nickname).join(", "),
      likeCount,
      isLiked,
      image: novel.cover_image,
    };
  }

  // 내가쓴 글 보기
  async findMyNovels(userId: number) {
    return this.novelRepo.find({
      where: { creator: { id: userId } }, // 만약 소설 작성자가 creator라면
      relations: ["creator"], // 또는 "author" 관계에 맞춰서
      order: { created_at: "DESC" },
    });
  }

  // 검색(제목 기준)
  async searchNovelsByTitle(query: string): Promise<Novel[]> {
    return this.novelRepo.find({
      where: { title: Like(`%${query}%`) },
      order: { created_at: "DESC" },
    });
  }
}
