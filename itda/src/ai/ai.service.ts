import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import fetch from "node-fetch";
import fs from "node:fs";

@Injectable()
export class AiService {
  private readonly Gemini_API =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  // const apiKey = this.configService.get<string>('GOOGLE_GEMINI_KEY');

  constructor(private readonly configService: ConfigService) {}
}
