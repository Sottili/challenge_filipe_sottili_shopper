// Import das functions do Google
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Ativação das .env
import dotenv from "dotenv";
dotenv.config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

export const uploadImage = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);
