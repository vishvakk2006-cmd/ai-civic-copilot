import { apiUrl } from "./api";

export async function uploadDocument(file) {
    const formData = new FormData();
    formData.append("document", file);

    const response = await fetch(apiUrl("/api/upload"), {
        method: "POST",
        body: formData
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(result.message || `Upload failed (${response.status}).`);
    }
    return result;
}