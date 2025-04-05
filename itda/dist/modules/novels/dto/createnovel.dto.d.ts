export declare class CreateNovelDto {
    title: string;
    category: string;
    peopleNum: string;
    content: string;
    type: "home" | "relay" | "contest";
    age_group: "teen" | "twenties" | "thirties" | "forties";
    userId: number;
}
