import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import mainRoutes from "./routes/main.route";
import dbConnection from "./config/db.config";
import swaggerMiddleware from "./middleware/swagger.middleware";
import { apiLoggerMiddleware } from "./middleware/apiLogger.middleware";
import http from "http";
import { initializeSocket } from "./socket/index";
import winston from "winston";
import AuthService from "./services/auth/auth.service";

import httpStatusConstant from "./constant/httpStatus.constant";

dotenv.config();
const app = express();

const { PORT, MONGO_URL } = process.env;

if (!MONGO_URL) {
  console.error("MONGO_URL environment variable is not defined");
  process.exit(1);
}

dbConnection(MONGO_URL);

//socket
const server = http.createServer(app);
const io = initializeSocket(server);

app.set("io", io);

/**
 * Setup Winston logger
 */
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { backend: "backend" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({ filename: "logs/index.log" }),
  ],
});

//middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '100kb' }));
app.use(bodyParser.json({ limit: '100kb' }));
app.use(cookieParser());

// Response size limit middleware (50KB)
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (body) {
      const size = Buffer.byteLength(JSON.stringify(body));
      if (size > 100 * 1024) {
        console.warn(`[Size Limit] Outgoing response too large (${(size / 1024).toFixed(2)} KB) for ${req.method} ${req.originalUrl}`);
        return res.status(httpStatusConstant.PAYLOAD_TOO_LARGE).send({
          success: false,
          message: "JSON GET response size limit exceeded. Please reduce response size to 100KB or less."
        });
      }
    }
    return originalJson.call(this, body);
  };
  next();
});

// CORS configuration - origin must be specific (not "*") when credentials: true
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://admin.vertev.in",
    "https://vertev.in",
    "http://localhost:8000",
  ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Required for httpOnly cookies
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

// Setup Swagger UI with custom middleware
swaggerMiddleware(app);

// API Logger Middleware - Track all API calls automatically
app.use(apiLoggerMiddleware);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Ui-studio Backend API",
    swagger: "/api-docs",
    health: "/health",
  });
});

// Routes
app.use("/api", mainRoutes);

//seeding default admin user
AuthService.CreateDefaultAdmin();

const port = PORT || 5000;

app.listen(port, () => {
  console.log(`swagger is running on http://localhost:${port}/api-docs`);
  console.log(`app is running on http://localhost:${port} `);
  console.log(`model visualizer is running on http://localhost:${port}/visualizer `);
});
