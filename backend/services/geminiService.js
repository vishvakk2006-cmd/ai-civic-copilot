import process from "node:process";

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";

export async function askGemini(question) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        const error = new Error(
            "The AI assistant is unavailable because GEMINI_API_KEY is not configured."
        );
        error.statusCode = 503;
        throw error;
    }

    const configuredModel = process.env.GEMINI_MODEL?.trim();
    const model =
        !configuredModel || configuredModel === "gemini-2.5-flash"
            ? DEFAULT_GEMINI_MODEL
            : configuredModel;
    const response = await fetch(
        `${GEMINI_API_URL}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: question }] }],
                systemInstruction: {
                    parts: [
                        {
                            text: "You are an informational assistant about Indian public benefit schemes. Do not claim official eligibility or approval. Clearly distinguish general information from official government decisions and recommend checking the scheme's official source."
                        }
                    ]
                }
            }),
            signal: AbortSignal.timeout(20000)
        }
    );

    if (!response.ok) {
        const error = new Error(
            response.status === 404
                ? `Gemini model "${model}" is unavailable to the configured API key. Check GEMINI_MODEL and GEMINI_API_KEY access in the backend deployment.`
                : `The AI assistant request failed (HTTP ${response.status}).`
        );
        error.statusCode = 502;
        throw error;
    }

    const result = await response.json();
    const answer = result.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim();

    if (!answer) {
        const error = new Error("The AI assistant returned no answer.");
        error.statusCode = 502;
        throw error;
    }

    return answer;
}
