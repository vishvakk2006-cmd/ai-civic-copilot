import express from "express";
import cors from "cors";

import citizen from "./data/citizen.json" with { type: "json" };
import { checkEligibility } from "./services/eligibilityEngine.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/message", (req, res) => {
    res.json({
        message: "AI Civic Copilot Backend Running"
    });
});

app.get("/eligible-schemes", (req, res) => {

    const eligibleSchemes = checkEligibility(citizen);

    res.json(eligibleSchemes);

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});