const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

// routers import
const userRouter = require("./routes/user.route.js");
const authRouter = require("./routes/auth.route.js");
const listRouter = require("./routes/list.route.js");

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to Mongodb"))
  .catch((err) => console.log(err));

const __dname = path.resolve();

const app = express();

//For JSON read
app.use(express.json());

//For Cookie read
app.use(cookieParser());

//Server Listen
app.listen(3000, () => {
  console.log("Server running!!!");
});

//User Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/list", listRouter);

app.use(express.static(path.join(__dname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dname, "frontend", "dist", "index.html"));
});

//Error Route
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error!";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
