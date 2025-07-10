// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { SUMMARY_SYSTEM_PROMPT } from '@/utils/prompts';

// const geneAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// export const generateSummaryFromGemini = async (pdfText) => {
//   try {
//     const model = geneAI.getGenerativeModel({
//       // model: 'gemini-2.0-flash',
//       model: 'gemini-1.5-pro-002',
//       generationConfig: {
//         temperature: 0.7,
//         maxOutputTokens: 1500,
//       },
//     });

//     const prompt = {
//       contents: [
//         {
//           role: 'user',
//           parts: [
//             { text: SUMMARY_SYSTEM_PROMPT },
//             {
//               text: `Transform this document into an engaging, easy—to—read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
//             },
//           ],
//         },
//       ],
//     };
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const responseText = await response.text();
//     if (!responseText) {
//       throw new Error(`Empty Response from Gemini`);
//     }
//     return responseText;
//   } catch (err) {
//     console.error('Gemini API Error', err);
//     throw err;
//   }
// };
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateSummaryFromGemini(text: string, maxRetries = 3): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing Gemini API key - please set GEMINI_API_KEY environment variable");
  }

  let retries = 0;
  let lastError;

  while (retries <= maxRetries) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Switch to flash model

      const prompt = {
        contents: [
          {
            parts: [
              {
                text: `Please summarize the following text in a concise manner, highlighting the key points and main ideas:
                
                ${text}`,
              },
            ],
          },
        ],
      };

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = await response.text();

      if (!responseText) {
        throw new Error("Empty response from Gemini API");
      }

      return responseText;
    } catch (error: any) {
      lastError = error;

      // Check if it's a rate limit error (429)
      if (error.status === 429) {
        // Extract retry delay from error if available, or use exponential backoff
        const retryDelay = error.errorDetails?.[0]?.["@type"]?.includes("RetryInfo")
          ? parseInt(error.errorDetails[0].retryDelay.replace('s', '')) * 1000
          : Math.pow(2, retries) * 1000;

        console.log(`Rate limit exceeded. Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retries++;
      } else {
        // For other errors, don't retry
        break;
      }
    }
  }

  console.error("Gemini API Error", lastError);
  throw lastError || new Error("Failed to generate summary with Gemini API");
}
