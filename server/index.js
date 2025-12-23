const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const rooms = require("./room");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// 👉 Serve frontend

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);

    if (rooms[roomId]) {
      socket.emit("sync-state", rooms[roomId]);
    }
  });

  socket.on("video-event", ({ roomId, type, data }) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId] = { ...rooms[roomId], ...data };

    socket.to(roomId).emit("video-event", { type, data });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });

  socket.on("webrtc-offer", ({ roomId, offer }) => {
  socket.to(roomId).emit("webrtc-offer", { offer });
});

socket.on("webrtc-answer", ({ roomId, answer }) => {
  socket.to(roomId).emit("webrtc-answer", { answer });
});

socket.on("webrtc-ice-candidate", ({ roomId, candidate }) => {
  socket.to(roomId).emit("webrtc-ice-candidate", { candidate });
});

});

app.get("/", (req, res) => {
  res.send("WDP Watch2Gether Backend is running 🚀");
});

