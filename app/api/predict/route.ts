import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function runPrediction(name: string, metadata: any, provider: 'nvidia' | 'gemini') {
    const browserContext = metadata ? `
    Browser Metadata Context:
    - Locale: ${metadata.locale}
    - Timezone: ${metadata.timezone}
    - Current Local Time: ${metadata.localTime}
    - UI Theme Preference: ${metadata.theme}
    (Use this info to make your prediction feel more personal and "spookily" accurate, but don't just list the facts back.)` : "";

    const prompt = `You are a hilarious expert on how names get "butchered" on Starbucks coffee cups. Based on the name "${name}", generate the most likely (and funniest) way a barista would write it on a cup.
    
    Return the result in a clean JSON format (no markdown blocks, just the JSON string) with these exact keys: 
    "starbucksName": "The hilarious misspelling on the cup",
    "rationale": "A brief, witty explanation of why they got it so wrong",
    "safeAlias": "A much simpler, 'safe' name this person can use for an easy experience (e.g., Bob, Sam, Lee)",
    "struggleRating": "How hard it is for a barista to hear this name (1-10)"

    Keep it witty, slightly sarcastic, and very entertaining.`;

    if (provider === 'nvidia') {
        const apiKey = process.env.NVIDIA_API_KEY;
        const apiUrl = process.env.NVIDIA_API_URL || "https://integrate.api.nvidia.com/v1/chat/completions";
        const model = process.env.NVIDIA_MODEL_2 || "moonshotai/kimi-k2.5";

        if (!apiKey) throw new Error("NVIDIA_API_KEY not found");

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 16384,
                temperature: 1.0,
                top_p: 1.0,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Nvidia API error: ${response.status} ${errorBody}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content.replace(/```json|```/g, "").trim());
    } else {
        const modelName = process.env.GOOGLE_MODEL_5 || "gemini-2.0-flash";
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = (await result.response).text();
        return JSON.parse(text.replace(/```json|```/g, "").trim());
    }
}

export async function POST(req: Request) {
    try {
        const { name, metadata } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Attempt NVIDIA first
        try {
            console.log("Attempting prediction with NVIDIA...");
            const data = await runPrediction(name, metadata, 'nvidia');
            return NextResponse.json({ ...data, provider: "nvidia" });
        } catch (nvError) {
            console.error("NVIDIA prediction failed, falling back to Gemini:", nvError);

            // Fallback to Gemini
            try {
                console.log("Attempting prediction with Gemini...");
                const data = await runPrediction(name, metadata, 'gemini');
                return NextResponse.json({ ...data, provider: "gemini" });
            } catch (gemError) {
                console.error("Gemini prediction also failed:", gemError);
                return NextResponse.json({ error: "All prediction providers failed" }, { status: 500 });
            }
        }
    } catch (error) {
        console.error("Error in prediction route:", error);
        return NextResponse.json({ error: "Failed to fetch prediction" }, { status: 500 });
    }
}
