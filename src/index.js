require("dotenv").config();

const express = require("express");

const connectDb = require("./config/db.config");
const authMiddleware = require("./middlewares/auth.middleware");
const authRoute = require("./routes/auth.route");

const app = express();

app.use(express.json());

app.use("/", authRoute);
app.use(authMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const connectDatabase = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    console.log("Connected to the database");
  } catch (err) {
    console.log(err.message);
  }
};

connectDatabase();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
