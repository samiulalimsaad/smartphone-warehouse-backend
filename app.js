import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { Inventory } from "./Model/inventory.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ hello: "hello" });
});

app.get("/inventories", async (req, res) => {
    const inventory = await Inventory.find({});
    res.json({
        inventory,
        success: true,
    });
});

app.get("/inventories/:id", async (req, res) => {
    const inventory = await Inventory.findOne({ _id: req.params.id });
    res.json({
        inventory,
        success: true,
    });
});

app.post("/inventories", async (req, res) => {
    const inventoryData = new Inventory(req.body);
    const inventory = await inventoryData.save();
    res.json({
        inventory,
        success: true,
        message: "successfully added",
    });
});

app.listen(PORT, async () => {
    console.log(`server is running at http://localhost:${PORT}`);
    mongoose.connect(
        process.env.DATABASE_URL,
        {
            useNewUrlParser: true,
        },
        () => {
            console.log("Database is connected");
        }
    );
});
