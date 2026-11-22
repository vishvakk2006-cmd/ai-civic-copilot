const configuredApiUrl =
    import.meta.env.VITE_API_URL?.trim() ||
    (import.meta.env.DEV ? "http://localhost:5000" : "");
export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, "");
export const API_CONFIG_ERROR =
    import.meta.env.PROD && !API_BASE_URL
        ? "Backend URL is not configured. Set VITE_API_URL in the frontend deployment environment."
        : "";

export function apiUrl(path) {
    if (!API_BASE_URL) {
        throw new Error(API_CONFIG_ERROR);
    }
    return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function requestJson(path, options) {
    const response = await fetch(apiUrl(path), options);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || `Request failed (${response.status}).`);
    }

    return result;
}

export function checkEligibility(citizen) {
    return requestJson("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(citizen)
    });
}

export function askAssistant(question) {
    return requestJson("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });
}
