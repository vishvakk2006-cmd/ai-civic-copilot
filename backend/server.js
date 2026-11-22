import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import process from "node:process";
import cors from "cors";
import express from "express";
import documentRoutes from "./routes/documentRoutes.js";
import schemeRoutes from "./routes/schemes.js";
import { checkMissingDocuments } from "./services/documentEngine.js";
import { generateExplanation } from "./services/explanationEngine.js";
import { askGemini } from "./services/geminiService.js";
import { checkEligibility, findIncompleteSchemes } from "./services/eligibilityEngine.js";
import { rankSchemes } from "./services/recommendationEngine.js";
import { evaluateRule } from "./services/ruleInterpreter.js";

const envPath = fileURLToPath(new URL("./.env", import.meta.url));
if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
}

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push("http://localhost:5173", "http://127.0.0.1:5173");
}

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error("Origin is not allowed by CORS."));
        }
    })
);
app.use(express.json({ limit: "32kb" }));

app.get("/", (req, res) => {
    res.send("AI Civic Copilot Backend Running");
});

app.get("/healthz", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/message", (req, res) => {
    res.json({ message: "AI Civic Copilot Backend Running" });
});

app.use("/api", documentRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/schemes", schemeRoutes);

app.post("/api/eligibility", (req, res) => {
    const citizen = req.body;
    if (!citizen || typeof citizen !== "object" || Array.isArray(citizen)) {
        return res.status(400).json({
            success: false,
            message: "Citizen details must be sent as a JSON object."
        });
    }

    for (const field of ["age", "annual_household_income", "child_age"]) {
        if (
            citizen[field] !== undefined &&
            (!Number.isFinite(citizen[field]) || citizen[field] < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: `${field} must be a non-negative number.`
            });
        }
    }

    for (const field of [
        "is_landholder",
        "has_active_bank_savings_account"
    ]) {
        if (
            citizen[field] !== undefined &&
            typeof citizen[field] !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message: `${field} must be true or false.`
            });
        }
    }

    if (
        citizen.provided_documents !== undefined &&
        (!Array.isArray(citizen.provided_documents) ||
            !citizen.provided_documents.every(
                (document) => typeof document === "string"
            ))
    ) {
        return res.status(400).json({
            success: false,
            message: "provided_documents must be a list of document names."
        });
    }

    const eligibleSchemes = rankSchemes(checkEligibility(citizen)).map(
        (scheme) => ({
            ...scheme,
            explanation: generateExplanation(citizen, scheme, evaluateRule),
            missing_documents: checkMissingDocuments(citizen, scheme)
        })
    );

    return res.json({
        success: true,
        totalEligible: eligibleSchemes.length,
        schemes: eligibleSchemes,
        incompleteSchemes: findIncompleteSchemes(citizen)
    });
});

app.post("/api/chat", async (req, res) => {
    const question =
        typeof req.body?.question === "string" ? req.body.question.trim() : "";
    if (!question || question.length > 2000) {
        return res.status(400).json({
            success: false,
            message: "Enter a question of 1 to 2000 characters."
        });
    }

    try {
        const answer = await askGemini(question);
        return res.json({ success: true, answer });
    } catch (error) {
        if (error.statusCode === 503) {
            return res.status(503).json({
                success: false,
                message: error.message
            });
        }
        console.error("AI assistant request failed:", error.message);
        return res.status(error.statusCode || 502).json({
            success: false,
            message: error.statusCode
                ? error.message
                : "The AI assistant could not complete the request. Please try again."
        });
    }
});

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found." });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
            success: false,
            message: "The document is too large. Maximum file size is 10 MB."
        });
    }
    if (error.message === "Origin is not allowed by CORS.") {
        return res.status(403).json({ message: error.message });
    }
    if (error.status === 400 && error.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON request body." });
    }
    if (error.message === "Upload a JPG, PNG, or PDF document.") {
        return res.status(400).json({ success: false, message: error.message });
    }

    console.error("Request failed:", error.message);
    return res.status(500).json({
        message: "The server could not complete the request."
    });
});

app.listen(port, "0.0.0.0", () => {
    console.log(`AI Civic Copilot backend listening on port ${port}.`);
});
