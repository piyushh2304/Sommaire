import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateSummaryFromGemini(
  text: string,
  maxRetries = 3,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key - please set GEMINI_API_KEY environment variable",
    );
  }

  let retries = 0;
  let lastError: unknown;

  while (retries <= maxRetries) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Pass the prompt as a string, not as an object with contents/parts
      const prompt = `Please summarize the following text in a concise manner, highlighting the key points and main ideas:\n\n${text}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = await response.text();

      if (!responseText) {
        throw new Error("Empty response from Gemini API");
      }

      return responseText;
    } catch (error: unknown) {
      lastError = error;

      // Type guard to check if error is an object with a status property
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error
      ) {
        // Narrow the error type for safe property access
        const err = error as {
          status?: number;
          errorDetails?: Array<{
            [key: string]: unknown;
            retryDelay?: string;
            "@type"?: string;
          }>;
        };

        // Handle rate limiting (status 429)
        if (err.status === 429) {
          let retryDelay = Math.pow(2, retries) * 1000; // default exponential backoff

          // If errorDetails has RetryInfo, use its retryDelay
          if (
            err.errorDetails &&
            err.errorDetails[0] &&
            typeof err.errorDetails[0]["@type"] === "string" &&
            err.errorDetails[0]["@type"]?.includes("RetryInfo") &&
            typeof err.errorDetails[0].retryDelay === "string"
          ) {
            const parsed = parseInt(
              err.errorDetails[0].retryDelay.replace("s", "")
            );
            if (!isNaN(parsed)) {
              retryDelay = parsed * 1000;
            }
          }

          console.log(
            `Rate limit exceeded. Retrying in ${retryDelay / 1000} seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          retries++;
          continue;
        }
      }

      // For all other errors or if type guard fails, break and throw
      break;
    }
  }

  console.error("Gemini API Error", lastError);
  throw lastError || new Error("Failed to generate summary with Gemini API");
}
