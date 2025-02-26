import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import Container, { Service } from "typedi";
import { Logger } from "./logger.service";


@Service()
class WebSocketService {
    private io!: Server;
    private logger = Container.get(Logger);
  
    public initialize(server: HttpServer) {
      this.io = new Server(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });
  
      this.io.on("connection", (socket) => {
        this.logger.info(`New client connected: ${socket.id}`);
  
        socket.on("disconnect", () => {
          this.logger.info(`Client disconnected: ${socket.id}`);
        });
      });
  
      this.logger.info("WebSocket server initialized");
    }
  
    // Emit the order update to the connected user
    public emitOrderUpdate(userId: string, update: { orderId: string; status: string }) {
      this.io.to(userId).emit("orderStatusUpdate", update);
      this.logger.info(`Order update sent to user ${userId}: ${update.status}`);
    }
  
    public getIO(): Server {
      return this.io;
    }
  }
  
export default WebSocketService;
