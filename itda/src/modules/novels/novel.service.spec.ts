import { Test, TestingModule } from "@nestjs/testing";
import { NovelService } from "./novel.service";

describe("StoryService", () => {
  let service: NovelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NovelService],
    }).compile();

    service = module.get<NovelService>(NovelService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
