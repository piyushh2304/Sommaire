"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchANdExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummary {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function getPsfText({
  fileUrl,
  fileName,
}: {
  fileUrl: string;
  fileName: string;
}) {
  if (!fileUrl) {
    return {
      success: false,
      message: "File Upload failed",
      data: null,
    };
  }
}

export async function generatePdfSummary({
  fileUrl,
  fileName,
}: {
  fileUrl: string;
  fileName: string;
}) {
  if (!fileUrl) {
    return {
      success: false,
      message: "File Upload failed",
      data: null,
    };
  }


  if (!fileUrl) {
    return {
      success: false,
      message: "File Upload failed",
      data: null,
    };
  }
  try {
    const pdfText = await fetchANdExtractPdfText(fileUrl);
    console.log({ pdfText });

    let summary;
    try {
      summary = await generateSummaryFromGemini(pdfText);
      console.log({ summary });
    } catch (error) {
      console.log(error);
      //call gemini-AI
      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        console.log("Gemini Rate Limit hit. Attempting fallback to OpenAI...");
        try {
          summary = await generateSummaryFromOpenAI(pdfText);
        } catch (openAIError) {
          console.log(
            "OpenAI API fallback failed",
            openAIError
          );
          throw new Error(
            "Failed to generate summary with available AI providers"
          );
        }
      }
    }
    if (!summary) {
      return {
        success: false,
        message: "File to generate summary",
        data: null,
      };
    }

    const formattedFileName = formatFileNameAsTitle(fileName);

    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        title: formattedFileName,
        summary,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "File Upload failed",
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummary) {
  //sql inserting pdf summary
  try {
    const sql = await getDbConnection();
    const [savedSummary] = await sql`
        INSERT INTO pdf_summaries (
          user_id,
          original_file_url,
          summary_text,
          title,
          file_name
        ) VALUES (
          ${userId},
          ${fileUrl},
          ${summary},
          ${title},
          ${fileName}
    ) RETURNING id, summary_text`;
    return savedSummary;
  } catch (error) {
    console.log("Error saving PDF Summary", error);
    throw error;
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummary) {
  //user is Logged in and has a userId
  //savePdf Summary
  //savePdfSUmmary()
  let savedSummary: any;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Ensure user exists in DB before attempting to save summary (prevents FK violation)
    const sql = await getDbConnection();
    const [userExists] = await sql`SELECT id FROM users WHERE id = ${userId}`;

    if (!userExists) {
      console.log("User not found in DB, executing proactive creation...");
      const user = await currentUser();
      const email = user?.emailAddresses[0]?.emailAddress;
      const fullName = user?.firstName + " " + user?.lastName;

      if (email) {
        try {
          await sql`
            INSERT INTO users (id, email, full_name, status)
            VALUES (${userId}, ${email}, ${fullName}, 'active')
            ON CONFLICT (id) DO NOTHING
          `;
          console.log("User created successfully.");
        } catch (dbError) {
          console.error("Failed to create user during proactive check:", dbError);
        }
      }
    }

    savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary, please try again!",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error Saving PDF Summary",
    };
  }
  //Step 6: Revalidate our cache
  revalidatePath(`/summaries/${savedSummary.id}`);
  return {
    success: true,
    message: "PDF Summary saved Successfully",
    data: {
      id: savedSummary.id,
    },
  };
}
