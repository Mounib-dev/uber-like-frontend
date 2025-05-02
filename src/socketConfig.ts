import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("connect_error", (error) => {
  console.error("Connection failed:", error);
});
