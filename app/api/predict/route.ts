import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");


async function runPrediction(name: string, metadata: any, provider: 'nvidia' | 'gemini') {


    const prompt = `You are a LEGENDARY comedy writer specializing in the hilariously chaotic world of Indian names at American Starbucks. Your mission: maximum giggles.

YOUR MISSION:
Transform "${name}" into the most hilariously wrong (but believable) Starbucks cup spelling that will make people CACKLE.

THE AMERICAN BARISTA REALITY:
- They've never heard these sounds before: retroflex consonants, aspirated sounds, Sanskrit origins
- Their brain desperately tries to map unfamiliar sounds to familiar English words
- They're convinced you said something they recognize (even if it makes NO sense)
- Classic disasters: "Rajesh" → "Roger," "Priya" → "Bria," "Nikhil" → "Nipple" (yes, really)

YOUR COMEDY GOLDMINE - INDIAN NAME PATTERNS:
1. **The English Name Autocorrect**: "Aarav" → "Aaron," "Ananya" → "Anya"
2. **The Accidental Word**: "Hardik" → "Hard Disk," "Diksha" → "Dixie Cup"
3. **The Celebrity Mix-up**: "Hrithik" → "Rick," "Deepika" → "Deepak Chopra"
4. **The Phonetic Nightmare**: Drop half the syllables, add random consonants
5. **The "I Gave Up"**: Just write something vaguely similar with 50% fewer letters

GO MAXIMUM ABSURD while staying believable. Think:
- What random English word sounds kinda similar?
- What if they only caught half the syllables?
- What common American name is "close enough"?
- Bonus: Tech terms, food items, place names that sound similar

OUTPUT (JSON ONLY - no markdown, no code blocks):
{
  "starbuckdName": "The magnificently wrong version",
  "rationale": "Your FUNNIEST explanation - this is the punchline!",
  "safeAlias": "A simple name that SOUNDS similar and preserves the vibe of the original",
  "struggleRating": <number 1-10>
}

SAFE ALIAS RULES (CRITICAL):
- MUST sound phonetically similar to "${name}" - keep key sounds/syllables
- Should feel like "close enough" not "completely different person"
- Think: "Priya" → "Ria" (not "Sarah"), "Rohan" → "Ron" (not "Dave"), "Anika" → "Nika" (not "Ashley")
- User should think "yeah, that's a shortened/easier version of MY name"
- Preserve the first sound/letter when possible for familiarity

RATIONALE TIPS FOR MAX FUNNY:
- Reference what they THOUGHT they heard
- Add a sarcastic observation about American barista logic
- Make it feel like a roast but keep it playful
- Example: "The barista heard your name and their brain said 'close enough to Jennifer!'"

TONE: Sharp, edgy, relatable to anyone who's had their name butchered. Channel the frustration AND the humor.

REMEMBER: Indian names are a GOLDMINE for comedy because of the phonetic gap. Lean into it hard.

Return ONLY the JSON object.`;

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

        // Attempt Gemini first
        try {
            console.log("Attempting prediction with Gemini...");
            const data = await runPrediction(name, metadata, 'gemini');
            return NextResponse.json({ ...data, provider: "gemini" });
        } catch (gemError) {
            console.error("Gemini prediction failed, falling back to NVIDIA:", gemError);

            // Fallback to NVIDIA
            try {
                console.log("Attempting prediction with NVIDIA...");
                const data = await runPrediction(name, metadata, 'nvidia');
                return NextResponse.json({ ...data, provider: "nvidia" });
            } catch (nvError) {
                console.error("NVIDIA prediction also failed:", nvError);
                return NextResponse.json({ error: "All prediction providers failed" }, { status: 500 });
            }
        }
    } catch (error) {
        console.error("Error in prediction route:", error);
        return NextResponse.json({ error: "Failed to fetch prediction" }, { status: 500 });
    }
}
