import { Server } from "socket.io";
import http from "node:http";
import express from "express";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http:
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const userSocketMap = {}; 

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("video_call_request", (data) => {
    const { to, callId, callerInfo } = data;

    console.log(`Video call request from ${socket.user.fullName} to ${to}`);

    const recipientSocketId = getReceiverSocketId(to);

    if (recipientSocketId) {

      io.to(recipientSocketId).emit("incoming_video_call", {
        callId,
        caller: callerInfo,
        timestamp: Date.now(),
      });

      console.log(` Invitation sent to ${to}`);
    }
  });

  socket.on("video_call_accepted", (data) => {
    const { callId, from, acceptedBy } = data;

    console.log(`Call ${callId} accepted by ${socket.user.fullName}`);

    const callerSocketId = getReceiverSocketId(from);

    if (callerSocketId) {

      io.to(callerSocketId).emit("video_call_peer_accepted", {
        callId,
        acceptedBy,
      });

      console.log(` Notified caller ${from} about acceptance`);
    }
  });

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

  socket.on("video_call_rejected", (data) => {
    const { callId, from, rejectedBy } = data;

    console.log(`Call ${callId} rejected by ${socket.user.fullName}`);

    const callerSocketId = getReceiverSocketId(from);

    if (callerSocketId) {

      io.to(callerSocketId).emit("video_call_peer_rejected", {
        callId,
        rejectedBy,
      });

      console.log(` Notified caller ${from} about rejection`);
    }
  });

  socket.on("video_call_cancelled", (data) => {
    const { callId, to } = data;

    console.log(`Call ${callId} cancelled by ${socket.user.fullName}`);

    const recipientSocketId = getReceiverSocketId(to);

    if (recipientSocketId) {

      io.to(recipientSocketId).emit("video_call_cancelled", {
        callId,
      });

      console.log(` Notified recipient ${to} about cancellation`);
    }
  });

});

export { io, server, app };
