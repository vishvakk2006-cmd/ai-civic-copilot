import { extractText } from "./services/ocrService.js";

const result = await extractText("./uploads/test.png");

console.log(result);