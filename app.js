require("dotenv").config();
require("./db");

const express = require("express");
const app = express();

require("./config")(app);

const { isAuthenticated } = require("./middleware/jwt.middleware")
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api", isAuthenticated, userRoutes);

const gameRoutes = require("./routes/game.routes");
app.use("/api", isAuthenticated, gameRoutes);

const commentRoutes = require("./routes/comment.routes");
app.use("/api", isAuthenticated, commentRoutes);

require("./error-handling")(app);

module.exports = app;
