export declare enum NovelType {
    NEW = "new",
    RELAY = "relay"
}
export declare enum AgeGroup {
    Teens = 10,
    Twenties = 20,
    Thirties = 30,
    Forties = 40
}
export declare class FilterNovelDto {
    type?: NovelType;
    genre?: string;
    age?: AgeGroup;
}
