import { Server } from "socket.io";
import http from "node:http";
import express from "express";
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

// Lấy socketId của người nhận dựa trên userId
export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

// Xử lý kết nối socket
io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // event : Gửi danh sách user online cho tất cả client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // Event : Xử lý ngắt kết nối (trạng thái user offline)
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  //
  // VIDEO CALL EVENTS
  // Event 1 : User A gửi yêu cầu gọi video
  socket.on("video_call_request", (data) => {
    const { to, callId, callerInfo } = data;

    console.log(`Video call request from ${socket.user.fullName} to ${to}`);

    // Tìm socket của người nhận (callee)
    const recipientSocketId = getReceiverSocketId(to);

    if (recipientSocketId) {
      // Gửi invitation đến người nhận
      io.to(recipientSocketId).emit("incoming_video_call", {
        callId,
        caller: callerInfo,
        timestamp: Date.now(),
      });

      console.log(` Invitation sent to ${to}`);
    }
  });

  // Event 2 : User B chấp nhận cuộc gọi
  socket.on("video_call_accepted", (data) => {
    const { callId, from, acceptedBy } = data;

    console.log(`Call ${callId} accepted by ${socket.user.fullName}`);

    // Tìm socket của người gọi (caller)
    const callerSocketId = getReceiverSocketId(from);

    if (callerSocketId) {
      // Notify người gọi rằng callee đã accept
      io.to(callerSocketId).emit("video_call_peer_accepted", {
        callId,
        acceptedBy,
      });

      console.log(` Notified caller ${from} about acceptance`);
    }
  });

  // Event 3: Notify rằng Stream call đã sẵn sàng (tránh race condition)
  socket.on("video_call_ready", (data) => {
    const { callId, to } = data;

    console.log(`🎬 Call ${callId} is ready`);

    const recipientSocketId = getReceiverSocketId(to);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("video_call_ready", {
        callId,
      });
    }
  });

  // Event 4: User B từ chối cuộc gọi
  socket.on("video_call_rejected", (data) => {
    const { callId, from, rejectedBy } = data;

    console.log(`Call ${callId} rejected by ${socket.user.fullName}`);

    // Tìm socket của người gọi
    const callerSocketId = getReceiverSocketId(from);

    if (callerSocketId) {
      // Notify người gọi rằng callee đã reject
      io.to(callerSocketId).emit("video_call_peer_rejected", {
        callId,
        rejectedBy,
      });

      console.log(` Notified caller ${from} about rejection`);
    }
  });

  // Event 5: User A hủy cuộc gọi (trong lúc đợi B accept)
  socket.on("video_call_cancelled", (data) => {
    const { callId, to } = data;

    console.log(`Call ${callId} cancelled by ${socket.user.fullName}`);

    // Tìm socket của người nhận
    const recipientSocketId = getReceiverSocketId(to);

    if (recipientSocketId) {
      // Notify người nhận rằng caller đã hủy
      io.to(recipientSocketId).emit("video_call_cancelled", {
        callId,
      });

      console.log(` Notified recipient ${to} about cancellation`);
    }
  });

  //
});

export { io, server, app };
