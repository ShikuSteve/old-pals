import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // adjust for your security needs
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for room join event
  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room ${roomName}`);
  });

  // Listen for sending a message
  socket.on("sendMessage", (message) => {
    if (message.room) {
      socket.to(message.room).emit("newMessage", message);
      socket.emit("newMessage", message); // Optionally send back to sender
    } else {
      io.emit("newMessage", message);
    }
  });
    socket.on("leaveRoom", (roomName) => {
    socket.leave(roomName);
    console.log(`Socket ${socket.id} left room ${roomName}`);
  });


  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(4000, () => {
  console.log("Socket server running on port 4000");
});
