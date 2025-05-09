import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/connectDB.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import flipbookRoutes from "./routes/flipbookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import scheduledFlipbookRoutes from "./routes/scheduledFlipbookRoutes.js";
import indexPageRoutes from "./routes/indexPageRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import reviewsOrMapRoutes from "./routes/reviewsOrMapRoutes.js";
import backCoverRoutes from './routes/backCoverRoutes.js';
import "./services/schedulerService.js";
import EventEmitter from 'events';
// Increase the listener limit
EventEmitter.defaultMaxListeners = 15;
dotenv.config();
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.CLIENT_URL, // Specify exact origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/flipbook", flipbookRoutes);
app.use("/api/scheduled-flipbooks", scheduledFlipbookRoutes);
app.use('/api', backCoverRoutes);
app.use("/api", indexPageRoutes);
app.use("/api", galleryRoutes);
app.use("/api", catalogRoutes);
app.use("/api", socialRoutes);
app.use("/api", reviewsOrMapRoutes);

app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Connect to database (run only once)

// ❌ REMOVE app.listen() (Vercel handles routing itself)
app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Listening on port ${process.env.PORT}`);
});

export default app;