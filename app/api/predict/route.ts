import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface PredictionTask {
    provider: 'nvidia' | 'gemini';
    model: string;
}

async function runPrediction(name: string, task: PredictionTask, signal: AbortSignal) {
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

    if (task.provider === 'nvidia') {
        const apiKey = process.env.NVIDIA_API_KEY;
        const apiUrl = process.env.NVIDIA_API_URL || "https://integrate.api.nvidia.com/v1/chat/completions";

        if (!apiKey) throw new Error("NVIDIA_API_KEY not found");

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                model: task.model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1024,
                temperature: 1.0,
                top_p: 1.0,
                stream: false,
            }),
            signal: signal
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Nvidia API error (${task.model}): ${response.status} ${errorBody}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        return { ...JSON.parse(content.replace(/```json|```/g, "").trim()), provider: `nvidia (${task.model})` };
    } else {
        const model = genAI.getGenerativeModel({ model: task.model });

        // Gemini SDK doesn't natively support AbortSignal in generateContent easily, 
        // but we can wrap it in a promise that rejects if the signal is aborted
        const predictionPromise = (async () => {
            const result = await model.generateContent(prompt);
            const text = (await result.response).text();
            return { ...JSON.parse(text.replace(/```json|```/g, "").trim()), provider: `gemini (${task.model})` };
        })();

        const abortPromise = new Promise((_, reject) => {
            if (signal.aborted) {
                reject(new Error("Aborted"));
            }
            signal.addEventListener("abort", () => reject(new Error("Aborted")));
        });

        return await Promise.race([predictionPromise, abortPromise]);
    }
}

export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const tasks: PredictionTask[] = [
            { provider: 'gemini', model: process.env.GOOGLE_MODEL_1 || "gemini-1.5-flash-lite" },
            { provider: 'gemini', model: process.env.GOOGLE_MODEL_2 || "gemini-1.5-flash" },
            { provider: 'gemini', model: process.env.GOOGLE_MODEL_4 || "gemini-2.0-flash-lite" },
            { provider: 'gemini', model: process.env.GOOGLE_MODEL_5 || "gemini-2.0-flash" },
            { provider: 'nvidia', model: process.env.NVIDIA_MODEL_1 || "moonshotai/kimi-k2.5" },
            { provider: 'nvidia', model: process.env.NVIDIA_MODEL_2 || "nvidia/nemotron-3-nano-30b-a3b" },
            { provider: 'nvidia', model: process.env.NVIDIA_MODEL_3 || "deepseek-ai/deepseek-v3.2" },
        ] as const;

        console.log(`🚀 Starting parallel race for "${name}" across ${tasks.length} models...`);

        // We want the first one to succeed
        const executeTask = async (task: PredictionTask) => {
            try {
                const startTime = Date.now();
                const result = await runPrediction(name, task, signal);
                const duration = Date.now() - startTime;

                if (!signal.aborted) {
                    console.log(`✅ WINNER: ${task.provider} (${task.model}) in ${duration}ms`);
                    controller.abort(); // Cancel others once we have a result
                    return result;
                }
                throw new Error("Aborted");
            } catch (err: any) {
                if (err.name === 'AbortError' || err.message === 'Aborted') {
                    throw err;
                }
                console.error(`❌ Task failed (${task.provider} - ${task.model}):`, err.message);
                throw err;
            }
        };

        try {
            // Promise.any waits for the first fulfilled promise
            const firstResult = await Promise.any(tasks.map(executeTask));
            return NextResponse.json(firstResult);
        } catch (aggregateError: any) {
            console.error("All providers failed:", aggregateError);
            return NextResponse.json({
                error: "The baristas are all on strike (All models failed).",
                details: aggregateError.errors?.map((e: any) => e.message) || [aggregateError.message]
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Error in prediction route:", error);
        return NextResponse.json({ error: "Failed to fetch prediction" }, { status: 500 });
    }
}
