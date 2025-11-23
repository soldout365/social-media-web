import express from "express";
import dotnetnv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

dotnetnv.config();

const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

// CORS - phải đặt trước các middleware khác
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Body parser với limit 10mb
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server dang chay tren port " + PORT);
  connectDB();
});
