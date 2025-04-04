import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}
}
