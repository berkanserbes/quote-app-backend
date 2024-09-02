const express = require("express");
const connectDb = require("./config/db.config");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
})

const connectDatabase = async () => {
    try {
        await connectDb(process.env.MONGO_URI);
        console.log("Connected to the database");
    } catch (err) {
        console.log(err.message);
    }
}

connectDatabase();


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});

