import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Inventory } from "./Model/inventory.js";

const app = express();
const PORT = process.env.PORT || 5000;

//  middleWares
// enable cors
app.use(cors());

app.use(express.json());

const verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "unauthorized access",
        });
    }
    const token = authHeader.split(" ")[1];
    await jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Forbidden access",
            });
        }
        req.email = decoded?.email;
        next();
    });
};

app.get("/", (req, res) => {
    res.json({ hello: "hello" });
});

app.get("/my-inventories", verifyUser, async (req, res) => {
    const email = (await req.query.email) || "";

    if (req.email === email) {
        const inventory = await Inventory.find({ email });
        return res.json({
            inventory,
            success: true,
        });
    }
    res.status(403).json({
        success: false,
        message: "Forbidden access",
    });
});

app.get("/inventories", async (req, res) => {
    const limit = +req.query.limit;
    const page = +req.query.page || 0;
    const skip = limit * page;
    let inventory = await Inventory.find({});
    const total = Math.floor(inventory.length / limit);
    inventory = inventory.slice(skip, skip + limit);
    res.json({
        total,
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

app.put("/inventories/:id", async (req, res) => {
    const inventory = await Inventory.findByIdAndUpdate(
        req.params.id,
        {
            quantity: req.body.quantity,
        },
        {
            new: true,
        }
    );
    res.json({
        inventory,
        success: true,
        message: "successfully updated",
    });
});

app.delete("/inventories/:id", async (req, res) => {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    res.json({
        inventory,
        success: true,
        message: "successfully deleted",
    });
});

app.post("/login", async (req, res) => {
    const token = jwt.sign(req.body, process.env.ACCESS_TOKEN, {
        expiresIn: "1d",
    });
    res.json({
        token,
        success: true,
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
