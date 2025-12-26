import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

export async function generateSummaryFromOpenAI(pdftext: string): Promise<string> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Summarize the following text.
          Strictly follow this format:
          1. Divide the summary into 4-5 "pages" or sections.
          2. Each section MUST start with a line containing only "# " followed by a concise Title.
          3. Under each title, provide 4-5 key points.
          4. Each point MUST start with a bullet point "• ".
          
          Text:
          \n\n${pdftext}.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    const content = completion.choices[0].message.content;
    if (content === null) {
      throw new Error("OpenAI response content is null");
    }
    return content;
  } catch (err: unknown) {
    // Type guard: ensure err is an object with a status property
    if (
      typeof err === "object" &&
      err !== null &&
      "status" in err
    ) {
      const errorWithStatus = err as { status?: number };
      if (errorWithStatus.status === 429) {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
    }
    throw err;
  }
}
