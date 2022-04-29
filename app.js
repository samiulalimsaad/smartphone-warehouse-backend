const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({ hello: "hello" });
});

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
