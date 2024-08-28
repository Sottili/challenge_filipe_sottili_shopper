import axios from "axios";

export class LLMService {
  private axiosInstance = axios;

  async extractMeasurementValue(imageUrl: string): Promise<{
    image_url: string;
    measure_value: number;
    measure_uuid: string;
  } | null> {
    try {
      const response = await this.axiosInstance.post(
        "https://api.google.com/gemini/vision",
        { imageUrl },
        { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
      );

      const { image_url, measure_value, measure_uuid } = response.data;

      if (image_url && measure_value !== undefined && measure_uuid) {
        return { image_url, measure_value, measure_uuid };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error extracting measurement value:", error);
      return null;
    }
  }
}
