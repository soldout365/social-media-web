import express from "express";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import streamRoutes from "./routes/stream.route.js";
import postRoutes from "./routes/post.route.js";
import brandRoutes from "./routes/brand.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import voucherRoutes from "./routes/voucher.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import { ENV } from "./lib/env.js";

import path from "path";

import cookieParser from "cookie-parser";
import cors from "cors";

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
app.use("/api/stream", streamRoutes);
app.use("/api/post", postRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/voucher", voucherRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

// Make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});
