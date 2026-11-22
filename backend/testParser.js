import fs from "fs";
import { parseCitizenData } from "./services/documentParser.js";

const text = fs.readFileSync("./ocrOutput.txt", "utf8");

console.log("Parsed citizen fields:", Object.keys(parseCitizenData(text)));