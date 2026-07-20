import express from "express";
import cors from "cors";

import schemes from "./data/schemes.json" with { type: "json" };
import { checkEligibility } from "./services/eligibilityEngine.js";
import { rankSchemes } from "./services/recommendationEngine.js";
import { generateExplanation } from "./services/explanationEngine.js";
import { evaluateRule } from "./services/ruleInterpreter.js";
import { checkMissingDocuments } from "./services/documentEngine.js";
import { calculateApprovalProbability } from "./services/approvalEngine.js";
import upload from "./services/uploadEngine.js";

import { extractText } from "./services/ocrService.js";
import { parseCitizenData } from "./services/documentParser.js";



const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// ======================
// Home
// ======================
app.get("/", (req, res) => {
    res.send("AI Civic Copilot Backend Running 🚀");
});

// ======================
// Health Check
// ======================
app.get("/message", (req, res) => {
    res.json({
        message: "AI Civic Copilot Backend Running"
    });
});

// ======================
// Get All Schemes
// ======================
app.get("/schemes", (req, res) => {
    res.json(schemes);
});

// ======================
// Get Scheme by ID
// ======================
app.get("/schemes/:id", (req, res) => {

    const scheme = schemes.find(
        s => s.scheme_id === req.params.id
    );

    if (!scheme) {
        return res.status(404).json({
            message: "Scheme not found"
        });
    }

    res.json(scheme);

});
   app.post("/api/upload", upload.single("document"), async (req, res) => {

    if (!req.file) {

        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });

    }

    try {

        const ocrResult = await extractText(req.file.path);
        console.log("===== OCR TEXT =====");
        console.log(ocrResult.text);
        console.log("====================");

        if (!ocrResult.success) {

            return res.status(500).json({
                success: false,
                message: "OCR failed"
            });

        }

        const extractedData = parseCitizenData(
            ocrResult.text
        ); 
        console.log("===== PARSED DATA =====");
        console.log(extractedData);
        console.log("=======================");

        res.json({

            success: true,

            filename: req.file.filename,

            confidence: ocrResult.confidence,

            extractedData

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});


// ======================
// Eligibility API
// ======================
app.post("/api/eligibility", (req, res) => {

    console.log("========== API HIT ==========");
    console.log("Incoming Citizen:");
    console.log(req.body);

    try {

        const citizen = req.body;

        const eligibleSchemes = checkEligibility(citizen);

        console.log("Eligible Schemes:");
        console.log(eligibleSchemes);

        const recommendedSchemes = rankSchemes(eligibleSchemes);

        const finalSchemes = recommendedSchemes.map((scheme) => ({

    ...scheme,

        approval_probability: calculateApprovalProbability(
            citizen,
            scheme
        ),

        explanation: generateExplanation(
            citizen,
            scheme,
            evaluateRule
        ),

        missing_documents: checkMissingDocuments(
            citizen,
            scheme
        )

    }));

        console.log("Recommended Schemes:");
        console.log(recommendedSchemes);

        res.json({
        success: true,
        citizen,
        totalEligible: finalSchemes.length,
        schemes: finalSchemes
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

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});