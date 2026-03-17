import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import dotenv from "dotenv";
import winston from "winston";
import { verifyTokenThroughSocket } from "../middleware/auth.middleware";

dotenv.config();

// Extend Socket interface to include userId
interface ExtendedSocket extends Socket {
  userId?: string;
}

// Create logger instance
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

const initializeSocket = (server: HttpServer): Server => {
    try {
        console.log("Initializing Socket.io...");
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
                credentials: true,
            },
            path: process.env.SOCKET_PATH || "/socket.io",
            transports: ["websocket", "polling"],
            pingTimeout: 60000,
            pingInterval: 25000,
        });

        io.on("connection", async (socket: ExtendedSocket) => {
            console.log("New client connected:", socket.id);

            // Authenticate socket connection
            try {
                console.log("socket token:", socket.handshake.auth);
                const token = socket.handshake.auth.token as string;
                if (!token) {
                    console.log("Socket authentication failed: No token provided");
                    socket.emit("auth_error", { message: "No token provided" });
                    socket.disconnect();
                    return;
                }

                // Verify token and wait for result
                const response = await verifyTokenThroughSocket(token);

                if (!response.success) {
                    console.log("Socket authentication failed:", response.message);
                    socket.emit("auth_error", { message: response.message || "Token validation failed" });
                    socket.disconnect();
                    return;
                }

                const decoded = response.data;
                console.log("decode user:", decoded);
                console.log("Socket authenticated for user:", decoded);

                // Set user ID - note that decoded already contains userId, not nested in user object
                socket.userId = decoded.userId;

                // Join user to their own room for targeted messages
                socket.join(`user_${socket.userId}`);

                // Send success authentication message
                socket.emit("authenticated", {
                    message: "Successfully authenticated",
                    userId: socket.userId,
                });
            } catch (error: any) {
                console.error("Socket authentication error:", error);
                logger.error("Socket authentication error:", {
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString(),
                });

                socket.emit("auth_error", { message: "Invalid token" });
                socket.disconnect();
                return;
            }

            // Handle order updates
            socket.on("join_order", (orderId: string) => {
                socket.join(`order_${orderId}`);
                console.log(`User ${socket.userId} joined order room: ${orderId}`);
            });

            // Handle disconnections
            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
                if (socket.userId) {
                    logger.info(`User disconnected: ${socket.userId}`, {
                        timestamp: new Date().toISOString(),
                    });
                }
            });
        });

        return io;
    } catch (error: any) {
        console.error("Socket initialization error:", error);
        logger.error("Socket initialization failed:", {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        });
        throw error;
    }
};

export { initializeSocket };
