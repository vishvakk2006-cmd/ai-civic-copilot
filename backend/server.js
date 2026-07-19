import express from "express";
import cors from "cors";

import schemes from "./data/schemes.json" with { type: "json" };
import { checkEligibility } from "./services/eligibilityEngine.js";
import { rankSchemes } from "./services/recommendationEngine.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// =========================
// Home Route
// =========================
app.get("/", (req, res) => {
    res.send("AI Civic Copilot Backend Running 🚀");
});

// =========================
// Health Check
// =========================
app.get("/message", (req, res) => {
    res.json({
        message: "AI Civic Copilot Backend Running"
    });
});

// =========================
// Get All Schemes
// =========================
app.get("/schemes", (req, res) => {
    res.json(schemes);
});

// =========================
// Get Single Scheme
// =========================
app.get("/schemes/:id", (req, res) => {

    const scheme = schemes.find(
        (s) => s.scheme_id === req.params.id
    );

    if (!scheme) {
        return res.status(404).json({
            message: "Scheme not found"
        });
    }

    res.json(scheme);

});

// =========================
// Eligibility API
// =========================
app.post("/api/eligibility", (req, res) => {

    try {

        console.log("Incoming Citizen Data:");
        console.log(req.body);

        const citizen = req.body;

        const eligibleSchemes = checkEligibility(citizen);

        console.log("Eligible Schemes:");
        console.log(eligibleSchemes);

        const recommendedSchemes =
            rankSchemes(eligibleSchemes);

        console.log("Recommended Schemes:");
        console.log(recommendedSchemes);

        res.json({
            success: true,
            count: recommendedSchemes.length,
            schemes: recommendedSchemes
        });

    } catch (error) {

        console.error("SERVER ERROR:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

// =========================
// Start Server
// =========================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});