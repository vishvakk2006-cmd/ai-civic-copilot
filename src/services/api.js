const API = "http://localhost:5000/api/eligibility";

export async function checkEligibility(citizen) {

    const response = await fetch(API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(citizen)

    });

    return await response.json();
}