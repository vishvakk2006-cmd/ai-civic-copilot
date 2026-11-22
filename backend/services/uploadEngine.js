import multer from "multer";
import path from "node:path";

const allowedTypes = new Map([
    [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"],
    [".png", "image/png"],
    [".pdf", "application/pdf"]
]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    },
    fileFilter(req, file, callback) {
        const extension = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.get(extension) !== file.mimetype) {
            callback(new Error("Upload a JPG, PNG, or PDF document."));
            return;
        }
        callback(null, true);
    }
});

export default upload;
