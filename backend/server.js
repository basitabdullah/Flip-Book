import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/connectDB.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import flipbookRoutes from "./routes/flipbookRoutes.js";
import authRoutes from "./routes/authRoutes.js";

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
app.use("/api/flipbook", flipbookRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Connect to database (run only once)
connectDB();

// ❌ REMOVE app.listen() (Vercel handles routing itself)
// app.listen(process.env.PORT, () => {
//   console.log(`Listening on port ${process.env.PORT}`);
// });

export default app;
