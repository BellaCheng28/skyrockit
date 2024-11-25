import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import mongoose from "mongoose";
import methodOverride from "method-override";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
// new code below this line ---
app.use(express.static(path.join(__dirname, 'public')));
// new code above this line ---
import morgan from "morgan";
import session from "express-session";

import applicationsController from "./controllers/applications.js"
import authController from "./controllers/auth.js";
import passUserToView from "./middleware/passUserToView.js";
import isSignedIn from "./middleware/isSignedIn.js";

const port = process.env.PORT ? process.env.PORT : "3000";
import path from "path";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView)

app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/applications`);
  }
  else {
    res.render("index.ejs")
  }
});

app.use("/auth", authController);
app.use(isSignedIn)
app.use("/users/:userId/applications", applicationsController)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
