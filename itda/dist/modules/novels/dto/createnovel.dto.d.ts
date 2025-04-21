export declare class CreateNovelDto {
    categoryId: number;
    peopleNum: number;
    title: string;
    content: string;
    type: "new" | "relay";
    imageUrl?: string;
}
