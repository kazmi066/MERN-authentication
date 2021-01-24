const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/users");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Constants

// Middlewares
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: false,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: process.env.sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 3600000, // in ms
      sameSite: true,
    },
  })
);

// Database connection
mongoose.connect(
  process.env.DB,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("Database connected");
    } else {
      console.log("Error connecting to database");
    }
  }
);

// Routes
app.use("/api/user", users);

app.listen(process.env.PORT, () => {
  console.log(`Server Running on http://localhost:${process.env.PORT}`);
});
