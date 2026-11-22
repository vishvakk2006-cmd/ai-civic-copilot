import assert from "node:assert/strict";
import process from "node:process";
import test from "node:test";
import { askGemini } from "../services/geminiService.js";

test("uses a current default model and explains unavailable-model errors", async () => {
    const originalFetch = globalThis.fetch;
    const originalApiKey = process.env.GEMINI_API_KEY;
    const originalModel = process.env.GEMINI_MODEL;
    let response;
    let requestUrl;

    process.env.GEMINI_API_KEY = "test-key";
    delete process.env.GEMINI_MODEL;
    globalThis.fetch = async (url) => {
        requestUrl = String(url);
        return response;
    };

    try {
        response = new Response(
            JSON.stringify({
                candidates: [{ content: { parts: [{ text: "Hello." }] } }]
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

        assert.equal(await askGemini("Hi"), "Hello.");
        assert.match(
            requestUrl,
            /\/models\/gemini-3\.5-flash-lite:generateContent\?/
        );

        process.env.GEMINI_MODEL = "gemini-2.5-flash";
        response = new Response(
            JSON.stringify({
                candidates: [{ content: { parts: [{ text: "Hello." }] } }]
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
        assert.equal(await askGemini("Hi"), "Hello.");
        assert.match(
            requestUrl,
            /\/models\/gemini-3\.5-flash-lite:generateContent\?/
        );

        response = new Response("", { status: 404 });
        await assert.rejects(
            askGemini("Hi"),
            /Gemini model "gemini-3\.5-flash-lite" is unavailable/
        );
    } finally {
        globalThis.fetch = originalFetch;
        if (originalApiKey === undefined) {
            delete process.env.GEMINI_API_KEY;
        } else {
            process.env.GEMINI_API_KEY = originalApiKey;
        }
        if (originalModel === undefined) {
            delete process.env.GEMINI_MODEL;
        } else {
            process.env.GEMINI_MODEL = originalModel;
        }
    }
});
