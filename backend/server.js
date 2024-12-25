import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/connectDB.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import pageRoutes from "./routes/pageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();
dotenv.config();
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

//ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/pages", pageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  connectDB();
});
