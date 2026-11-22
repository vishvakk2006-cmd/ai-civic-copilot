import express from "express";
import { Buffer } from "node:buffer";
import upload from "../services/uploadEngine.js";
import { extractText } from "../services/ocrService.js";
import { parseCitizenData } from "../services/documentParser.js";

const router = express.Router();

function hasExpectedSignature(file) {
    const bytes = file.buffer;
    if (file.mimetype === "application/pdf") {
        return bytes.subarray(0, 5).toString("ascii") === "%PDF-";
    }
    if (file.mimetype === "image/png") {
        return bytes.subarray(0, 8).equals(
            Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
        );
    }
    if (file.mimetype === "image/jpeg") {
        return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    }
    return false;
}

router.post("/upload", upload.single("document"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Choose a JPG, PNG, or PDF document to upload."
        });
    }

    if (!hasExpectedSignature(req.file)) {
        return res.status(400).json({
            success: false,
            message: "The file contents do not match the selected document type."
        });
    }

    const result = await extractText(req.file.buffer, req.file.mimetype);
    if (!result.success) {
        return res.status(422).json({
            success: false,
            message: result.message
        });
    }

    const extractedData = parseCitizenData(result.text);
    const notes = [result.note];
    if (Object.keys(extractedData).length === 0) {
        notes.push(
            "Text was read, but no supported profile fields were recognized. Enter your details manually."
        );
    }

    return res.json({
        success: true,
        confidence: result.confidence,
        note: notes.filter(Boolean).join(" "),
        extractedData
    });
});

export default router;