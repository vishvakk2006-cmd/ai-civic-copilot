import { readFile } from "node:fs/promises";
import { extractText } from "./services/ocrService.js";
import { parseCitizenData } from "./services/documentParser.js";

const image = await readFile("./uploads/test.PNG");
const result = await extractText(image, "image/png");
console.log({
    success: result.success,
    confidence: result.confidence,
    extractedFields: Object.keys(parseCitizenData(result.text))
});