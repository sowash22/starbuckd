import { NextResponse } from "next/server";

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

        const apiUrl = process.env.BACKEND_API_URL || "https://backend-server-fast-1.vercel.app/v1/chat/completions";
        const apiKey = process.env.CLIENT_API_KEY;

        if (!apiKey) {
            throw new Error("CLIENT_API_KEY is not configured");
        }

        console.log(`🚀 Requesting prediction for "${name}" from LLM Racing API...`);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "X-Client-ID": "starbuckd",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: prompt }],
                stream: false,
                temperature: 1.0,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Proxy API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Handle potential markdown backticks in response
        const cleanContent = content.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanContent);

        const validated = validatePredictionResult(name, parsed);

        return NextResponse.json({
            ...validated,
            provider: data.model || "llm-race"
        });

    } catch (error: any) {
        console.error("Error in prediction route:", error);
        return NextResponse.json({
            error: "The baristas are all on strike (API Failure).",
            details: error.message
        }, { status: 500 });
    }
}
