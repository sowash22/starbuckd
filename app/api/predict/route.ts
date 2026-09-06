import { NextResponse } from "next/server";

const INFERENCE_TIMEOUT_MS = 12_000;

type CompletionResponse = {
    model?: string;
    choices?: Array<{ message?: { content?: unknown } }>;
};

function v2Endpoint(): string | null {
    const raw = process.env.BACKEND_API_URL?.trim();
    if (!raw) return null;
    try {
        const url = new URL(raw);
        const path = url.pathname.replace(/\/$/, "");
        if (path !== "/v2/chat/completions" || (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1")) return null;
        return url.toString();
    } catch {
        return null;
    }
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

export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const prompt = `You are a busy coffee-shop barista with a dry sense of humor. Predict the believable name mistake you might make after hearing a customer over grinders, steam wands, and a morning rush.

INPUT NAME: ${JSON.stringify(String(name))}

Return one JSON object with exactly these fields:

1) "starbuckdName": the incorrect name written on the cup.
2) "safeAlias": a short, easy alternative the customer could use next time.
3) "rationale": a funny 1-2 sentence explanation in the barista's voice.
4) "struggleRating": an integer from 1 to 10.

REALISM RULES:
- The cup name must be a plausible mishearing or misspelling of the input. Preserve recognizable sounds; never choose a random joke word.
- The safe alias must sound close to the input and feel natural for that person. It is not another misspelling.
- All three names must be different after ignoring case and punctuation.
- For a simple or familiar name, make only a tiny mistake and rate it 1-3. It is okay for the joke to be subtle.
- For a moderately unfamiliar name, make a believable phonetic shortcut and rate it 4-6.
- Reserve ratings 7-9 for genuinely difficult names. Use 10 only for an exceptional tongue-twister.
- Keep names clean, non-offensive, and human-sounding.

HUMOR RULES:
- Be lightly sarcastic, specific, and conversational—not absurd or mean.
- The joke should come from barista confidence, café noise, rushed handwriting, or choosing the closest familiar sound.
- Do not mention being an AI. Do not explain these rules.

REFERENCE EXAMPLES (do not copy):
- "Siobhan" → "Shavon", alias "Shiv"
- "Nguyen" → "Win", alias "Wynn"
- "Priyanka" → "Bianca", alias "Priya"
- "Tom" → "Dom", alias "Tommy"

RETURN FORMAT — EXACTLY THIS, NO EXTRAS:
{
  "starbuckdName": "string",
  "rationale": "string",
  "safeAlias": "string",
  "struggleRating": 1
}`;

        const apiUrl = v2Endpoint();
        const apiKey = process.env.CLIENT_API_KEY?.trim();
        const provider = process.env.PROVIDER?.trim();

        if (!apiUrl || !apiKey) {
            throw new Error("V2 inference API is not configured");
        }

        console.log(`🚀 Requesting prediction for "${name}" from LLM Racing API...`);

        let lastError: Error | null = null;

        // One retry is cheaper than failing the request when a model emits malformed JSON.
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "X-Client-ID": process.env.CLIENT_ID?.trim() || "starbuckd",
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        messages: [{ role: "user", content: prompt }],
                        ...(attempt === 1 ? { response_format: { type: "json_object" } } : {}),
                        stream: false,
                        temperature: 0.9,
                        max_tokens: 700,
                        ...(provider ? { provider } : {}),
                    }),
                    cache: "no-store",
                    signal: AbortSignal.timeout(INFERENCE_TIMEOUT_MS),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Proxy API error: ${response.status} ${errorText}`);
                }

                const data = await response.json() as CompletionResponse;
                const content = data.choices?.[0]?.message?.content;
                if (typeof content !== "string") throw new Error("Model returned no content");

                const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
                const validated = validatePredictionResult(name, parsed);

                return NextResponse.json({
                    ...validated,
                    provider: data.model || "llm-race"
                });
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                console.warn(`Prediction attempt ${attempt} failed:`, lastError.message);
            }
        }

        throw lastError || new Error("Prediction failed");

    } catch (error: any) {
        console.error("Error in prediction route:", error);
        return NextResponse.json({
            error: "The baristas are all on strike (API Failure).",
            details: error.message
        }, { status: 500 });
    }
}
