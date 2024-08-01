import dotenv from "dotenv";

dotenv.config();
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "./configs/passport.config.js";
import flash from "connect-flash";
import expressLayouts from "express-ejs-layouts";
import { handleError } from "./middlewares/error.middleware.js";
import cors from "cors";
import { userRoutes } from "./src/routes/user.routes.js";

export const app = express();

// Setting up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("src", "views"));
app.use(expressLayouts);

app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false },
  })
);
app.use(flash());
// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

// Setting up express for parsing req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Making public folder publically accessible
app.use(express.static(path.resolve("public")));

// Homepage

// Routes
app.get("/", (req, res, next) => {
  res.render("index", { loggedIn: req.user });
});
app.use("/user", userRoutes);

// Error 404 handler
app.use((req, res, next) => {
  res.render("Error", {
    loggedIn: req.user,
    error: "Page not found",
    statusCode: 404,
  });
});
// Error Handler
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});
