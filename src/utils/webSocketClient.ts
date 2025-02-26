import { io, Socket } from "socket.io-client"; // Importing the Socket type

let socket: Socket; // Use the Socket type

// Function to initialize the WebSocket connection
export const initWebSocket = (userId: string) => {
  socket = io("http://localhost:3002");

  // Emit authentication event with the userId to link the socket with the user
  socket.emit("authenticate", { userId });

  // Listen for 'orderStatusUpdate' event and handle it
  socket.on("orderStatusUpdate", (update) => {
    console.log(`Order ${update.orderId} status updated to: ${update.status}`);
  });

  socket.on("connect", () => {
    console.log(`Connected to WebSocket server with ID: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected from WebSocket server`);
  });
};

// Function to send updates manually (if needed)
export const sendOrderUpdate = (userId: string, orderId: string, status: string) => {
  if (socket) {
    socket.emit("orderStatusUpdate", { orderId, status });
    console.log(`Sent order update to user ${userId}: Order ${orderId} status is now ${status}`);
  }
};

export const getSocket = () => socket;
