import Tesseract from "tesseract.js";

export async function extractText(imagePath) {

    try {

        const result = await Tesseract.recognize(
            imagePath,
            "eng"
        );

        return result.data.text;

    }

    catch (error) {

        console.error("OCR Error:", error.message);

        return "";

    }

}