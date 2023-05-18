const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
require("dotenv").config();

//! connecting mongoose to save user sessions even after server restart
mongoose
  .connect(process.env.MongoDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const store = new MongoDBSession({
  uri: process.env.MongoDB_URL,
  collection: "UserSessions",
});

//! Routers importation
const usersRouter = require("./routes/users");
const articlesRouter = require("./routes/articles");
const commentsRouter = require("./routes/commentaires");
const categoriesRouter = require("./routes/categories");

//! Middleware section
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 3600 * 1000, // 1day
      httpOnly: false,
    },
    store,
  })
);

//! Routes definition
app.use("/users", usersRouter);
app.use("/articles", articlesRouter);
app.use("/comments", commentsRouter);
app.use("/categories", categoriesRouter);

module.exports = app;
