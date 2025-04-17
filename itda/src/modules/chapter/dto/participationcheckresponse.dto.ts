import { ApiProperty } from "@nestjs/swagger";

export class ParticipationCheckResponseDto {
  @ApiProperty({
    example: true,
    description: "해당 유저가 소설에 이어쓴 기록이 있는지 여부",
  })
  hasParticipated: boolean;
}
