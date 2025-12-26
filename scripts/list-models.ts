import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // Start by trying .env.local
dotenv.config(); // Fallback to .env

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY not found in environment variables.");
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // There isn't a direct "listModels" on the instance in some SDK versions, 
        // but looking at recent docs, we might need to use the model manager if exposed, 
        // or just try a basic model to check connection. 
        // Actually, the SDK doesn't always expose listModels directly on the main class easily in all versions.
        // Let's try a direct fetch if the SDK doesn't make it easy, or just try to instantiate a few common ones.

        // Attempting to use the model, if it fails we catch it.
        console.log("Testing specific models...");

        const modelsToTest = ["gemini-pro", "gemini-1.5-pro", "gemini-1.0-pro"];

        for (const modelName of modelsToTest) {
            try {
                console.log(`Testing model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, are you there?");
                const response = await result.response;
                console.log(`✅ Success with ${modelName}:`, response.text().substring(0, 50) + "...");
                break; // Stop at first success
            } catch (error: any) {
                console.log(`❌ Failed with ${modelName}: ${error.message.split('\n')[0]}`);
            }
        }

    } catch (error) {
        console.error("Global Error:", error);
    }
}

listModels();
