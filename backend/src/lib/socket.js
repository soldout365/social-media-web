import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

//Client → gửi JWT cookie → Middleware verify → socket authenticated → connection → server lưu userId→socketId → broadcast online users → realtime
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const userSocketMap = {}; // Lưu trữ mapping userId → socketId

//check user on hoac off
export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

// Xử lý kết nối socket
io.on("connection", (socket) => {
  console.log("1 user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // Gửi danh sách user online cho tất cả client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Xử lý ngắt kết nối
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
