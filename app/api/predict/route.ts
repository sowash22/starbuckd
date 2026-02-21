import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface PredictionTask {
    provider: 'nvidia' | 'gemini';
    model: string;
}

function normalizeNameKey(value: string) {
    return value.toLowerCase().replace(/[^a-z]/g, "");
}

function validatePredictionResult(inputName: string, raw: any) {
    const starbuckdName = String(raw?.starbuckdName ?? "").trim();
    const rationale = String(raw?.rationale ?? "").trim();
    const safeAlias = String(raw?.safeAlias ?? "").trim();
    const struggleRating = Number(raw?.struggleRating);

    if (!starbuckdName || !rationale || !safeAlias) {
        throw new Error("Model returned missing required fields");
    }

    if (!Number.isFinite(struggleRating) || struggleRating < 1 || struggleRating > 10) {
        throw new Error("Model returned invalid struggleRating");
    }

    const userKey = normalizeNameKey(inputName);
    const baristaKey = normalizeNameKey(starbuckdName);
    const aliasKey = normalizeNameKey(safeAlias);

    // Enforce all 3 identity outputs to be distinct.
    if (!baristaKey || !aliasKey || userKey === baristaKey || userKey === aliasKey || baristaKey === aliasKey) {
        throw new Error("Model returned non-distinct names");
    }

    return {
        starbuckdName,
        rationale,
        safeAlias,
        struggleRating: Math.round(struggleRating),
    };
}

async function runPrediction(name: string, task: PredictionTask, signal: AbortSignal) {
    const prompt = `You are a world-weary Starbucks barista — underpaid, overcaffeinated, and profoundly indifferent to the correct spelling of names. You've seen things. You've written "Khaleesi" as "Kaleesy." You once wrote "Bob" as "Bop" and you stand by it.

INPUT NAME: "${name}"

YOUR SACRED MISSION:
Look at this name. Feel it. Fear it. Now butcher it onto a cup.

Return ONE JSON object with these 4 fields:

1) "starbuckdName"
   The name you actually write on the cup. This should feel like you heard it through a broken drive-thru speaker during a rush hour meltdown. Phonetic disasters encouraged. The more confident the mistake, the better.

2) "safeAlias"
   The name this person SHOULD use next time. Still sounds vaguely like them. Simple enough that even you, at 7:43am, could handle it.

3) "rationale"
   Your unhinged internal monologue explaining what went wrong. Be vivid. Be specific. Reference the noise, the stress, the existential dread. Maybe blame Mercury in retrograde. Maybe blame the customer. Definitely don't blame yourself. This should be 2-3 hilarious sentences that feel like a genuine confession.

4) "struggleRating"
   A number from 1–10 rating how hard this name wrecked you today.

RATING SCALE (for your reference):
1 = "This was a 'Mike.' I still somehow wrote 'Myke.' It was a bad day."
2-3 = Common name, minor fumble. One vowel gone. One consonant swapped.
4-5 = Uncommon but surviving. Creative phonetic interpretation. Plausible deniability.
6-7 = You needed help and there was no one. You just... committed.
8-9 = You heard 7 syllables and panicked. What is on this cup is not a name. It is a cry for help.
10 = You wrote something in a language you've never studied. You don't know how. You're scared.

STRICT OUTPUT RULES:
- Return JSON ONLY. No markdown. No code fences. Just raw JSON.
- ALL THREE names must be DIFFERENT from each other:
  - input name ≠ starbuckdName
  - input name ≠ safeAlias
  - starbuckdName ≠ safeAlias
- Names must be clean, non-offensive, and still vaguely human-sounding.
- starbuckdName should FEEL like a genuine honest mistake, not a random word.

QUALITY CALIBRATION:
- Simple names (Tom, Amy, Kate): subtle errors only. 1 letter off. struggleRating 1-3.
- Medium names (Jordan, Priya, Marcus): moderate errors. struggleRating 3-6.
- Complex names (Xiomara, Nizhoni, Lachlan): full phonetic chaos permitted. struggleRating 6-9.
- Unpronounceable-to-a-tired-person names: abandon all hope. struggleRating 8-10.

TONE EXAMPLES (vibes only, not exact outputs):
- "Siobhan" → barista writes "Shavon", thinks they nailed it, rationale is pure hubris
- "Nguyen" → barista writes "Win" because they gave up immediately and it's close enough
- "Bartholomew" → barista writes "Barty" and refuses to elaborate
- "Raj" → barista writes "Rodge" somehow, deeply confused about what happened
- "Aoife" → barista writes "Eefa" after a 3-second stare into the void

RETURN FORMAT — EXACTLY THIS, NO EXTRAS:
{
  "starbuckdName": "string",
  "rationale": "string",
  "safeAlias": "string",
  "struggleRating": 1
}`;

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
        const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
        return { ...validatePredictionResult(name, parsed), provider: `nvidia (${task.model})` };
    } else {
        const model = genAI.getGenerativeModel({ model: task.model });

        // Gemini SDK doesn't natively support AbortSignal in generateContent easily, 
        // but we can wrap it in a promise that rejects if the signal is aborted
        const predictionPromise = (async () => {
            const result = await model.generateContent(prompt);
            const text = (await result.response).text();
            const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
            return { ...validatePredictionResult(name, parsed), provider: `gemini (${task.model})` };
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
