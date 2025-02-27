import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.get("/", (req, res) => {
  res.send("WebSocket Service Running");
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("message", (msg) => {
    console.log("Message received:", msg);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(3001, () => {
  console.log("WebSocket server listening on port 3001");
});
