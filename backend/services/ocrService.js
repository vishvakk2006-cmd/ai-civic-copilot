import Tesseract from "tesseract.js";
import { PDFParse } from "pdf-parse";
import { fileURLToPath } from "node:url";

const languageDataDirectory = fileURLToPath(new URL("../", import.meta.url))
    .replace(/[\\/]$/, "");
const ocrOptions = {
    langPath: languageDataDirectory,
    gzip: false,
    cacheMethod: "none"
};

export async function extractText(file, mimeType) {
    try {
        if (mimeType === "application/pdf") {
            const parser = new PDFParse({ data: file });
            try {
                const result = await parser.getText({ first: 20 });
                const pageCount =
                    Number(result.total) || result.pages?.length || 1;
                let text = (result.text || "")
                    .replace(/--\s*\d+\s+of\s+\d+\s*--/g, "")
                    .trim();
                let confidence = null;
                let note =
                    pageCount > (result.pages?.length || 20)
                        ? "Only the first 20 PDF pages were processed."
                        : undefined;

                if (!text) {
                    const screenshots = await parser.getScreenshot({
                        first: Math.min(pageCount, 5),
                        scale: 1.5,
                        imageDataUrl: false
                    });
                    const pageTexts = [];
                    const confidences = [];
                    for (const page of screenshots.pages) {
                        const ocr = await Tesseract.recognize(
                            page.data,
                            "eng",
                            ocrOptions
                        );
                        pageTexts.push(ocr.data.text);
                        confidences.push(ocr.data.confidence);
                    }
                    text = pageTexts.join("\n").trim();
                    confidence = confidences.length
                        ? confidences.reduce((sum, value) => sum + value, 0) /
                          confidences.length
                        : 0;
                    if (pageCount > screenshots.pages.length) {
                        note = "Only the first five scanned PDF pages were processed.";
                    }
                }

                return text
                    ? { success: true, text, confidence, note }
                    : {
                          success: false,
                          text: "",
                          confidence: 0,
                          message: "No text could be read from this PDF."
                      };
            } finally {
                await parser.destroy();
            }
        }

        const { data } = await Tesseract.recognize(file, "eng", ocrOptions);
        const text = data.text.trim();
        return text
            ? {
                  success: true,
                  text,
                  confidence: data.confidence
              }
            : {
                  success: false,
                  text: "",
                  confidence: data.confidence,
                  message: "No text could be read from this image."
              };
    } catch (error) {
        console.error("Document text extraction failed:", error.message);
        return {
            success: false,
            text: "",
            confidence: 0,
            message: "Document text extraction failed. Try another file."
        };
    }
}
