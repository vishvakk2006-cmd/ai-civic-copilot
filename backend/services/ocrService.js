import Tesseract from "tesseract.js";

export async function extractText(imagePath) {

    try {

        const { data } = await Tesseract.recognize(
            imagePath,
            "eng"
        );

        return {
            success: true,
            text: data.text,
            confidence: data.confidence
        };

    } catch (error) {

        console.error(error);

        return {
            success: false,
            text: "",
            confidence: 0
        };

    }

}