import express from "express";
import schemes from "../data/schemes.json" with { type: "json" };

const router = express.Router();

router.get("/", (req, res) => {
    res.json(schemes);
});

router.get("/:id", (req, res) => {
    const scheme = schemes.find((item) => item.scheme_id === req.params.id);
    if (!scheme) {
        return res.status(404).json({ message: "Scheme not found." });
    }
    return res.json(scheme);
});

export default router;
