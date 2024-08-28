import { GoogleAIFileManager } from "@google/generative-ai/server";

export class GeminiService {
  private gen_key: string = process.env.GEMINI_API_KEY!;
  public genFileManager = new GoogleAIFileManager(this.gen_key);

  public upload = this.genFileManager.uploadFile;
}
