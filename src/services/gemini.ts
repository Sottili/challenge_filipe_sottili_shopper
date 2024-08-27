import { GoogleGenerativeAI } from "@google/generative-ai";

export class gemini {
  private gen_key: string = process.env.GEMINI_API_KEY!;
  private genAI = new GoogleGenerativeAI(this.gen_key);

  public model(): void {
    this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
}
