import express from "express";
import schemes from "../data/schemes.json" with { type: "json" };
import schemeRoutes from "./routes/schemes.js";
app.use(express.json());
app.use("/schemes", schemeRoutes);

const router = express.Router();

router.get("/", (req, res) => {
    res.json(schemes);
});

export default router;
router.get("/:id", (req, res) => {

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