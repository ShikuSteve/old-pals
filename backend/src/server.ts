import express from "express";
import http from "http";
import path from "path";
import multer from "multer";
import { Server } from "socket.io";
import cors from "cors";
import { mainroutes } from "./routes/main";
import type { Request, Response } from "express";
import mongoose from "mongoose";

// Set up MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://shalinewambui04:rQihPLvWVPcI8kH6@cluster0.gbkwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // adjust for your security needs
});

// Set up static file serving for uploaded files
app.use("/uploads", express.static("uploads"));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post(
  "/upload",
  upload.single("file"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    // Create the file URL; adjust the host/port if needed.
    const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  }
);

app.use("/api", mainroutes);

// Socket.io connection
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
