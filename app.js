import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ hello: "hello" });
});

app.get("/about", (req, res) => {
    res.json({ hello: "about" });
});

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
    mongoose.connect(
        process.env.DATABASE_URL,
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        },
        () => {
            console.log("Database is connected");
        }
    );
});
