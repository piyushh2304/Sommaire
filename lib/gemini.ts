import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateSummaryFromGemini(
  text: string,
  maxRetries = 2,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key - please set GEMINI_API_KEY environment variable",
    );
  }

  let retries = 0;
  let lastError: any;

  while (retries <= maxRetries) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Pass the prompt as a string, not as an object with contents/parts
      // Pass the prompt as a string, not as an object with contents/parts
      const prompt = `Please summarize the following text.
      Strictly follow this format:
      1. Divide the summary into 4-5 "pages" or sections.
      2. Each section MUST start with a line containing only "# " followed by a concise Title.
      3. Under each title, provide 4-5 key points.
      4. Each point MUST start with a bullet point "• ".
      5. Do not add any introductory text or markdown formatting (like **bold**) other than the required structure.

      Example Format:
      # Section Title 1
      • Key point one
      • Key point two

      # Section Title 2
      • Key point one...

      Text to summarize:
      \n\n${text}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = await response.text();

      if (!responseText) {
        throw new Error("Empty response from Gemini API");
      }

      return responseText;
    } catch (error: any) {
      lastError = error;

      // Handle rate limiting (status 429)
      if (error?.status === 429) {
        // Exponential backoff: 2s, 4s, 8s, 16s, 32s
        let retryDelay = Math.pow(2, retries) * 2000;

        console.log(
          `Rate limit exceeded. Retrying in ${retryDelay / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retries++;
        continue;
      }

      // For all other errors, break and throw
      break;
    }
  }

  console.error("Gemini API Error", lastError);

  if (lastError?.status === 429) {
    console.error("Gemini Rate Limit Retries Exhausted");
    throw new Error("RATE_LIMIT_EXCEEDED");
  }

  throw lastError instanceof Error ? lastError : new Error("Failed to generate summary with Gemini API");
}
