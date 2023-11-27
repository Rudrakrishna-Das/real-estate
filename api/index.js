const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// routers import
const userRouter = require("./routes/user.route.js");
const authRouter = require("./routes/auth.route.js");

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to Mongodb"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server running!!!");
});

//User Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
