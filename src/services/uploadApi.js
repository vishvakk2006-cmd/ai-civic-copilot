const API = "http://localhost:5000/api/upload";

export async function uploadDocument(file) {

    const formData = new FormData();

    formData.append("document", file);

    const response = await fetch(API, {
        method: "POST",
        body: formData
    });

    return await response.json();

}