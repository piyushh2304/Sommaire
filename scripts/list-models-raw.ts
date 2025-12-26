import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function listModelsRaw() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY not found.");
        process.exit(1);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const text = await response.text();
            console.error(`Error ${response.status}: ${text}`);
            return;
        }
        const data = await response.json();
        console.log("Available Models:");
        (data.models || []).forEach((model: any) => {
            console.log(`- ${model.name}`);
        });
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listModelsRaw();
