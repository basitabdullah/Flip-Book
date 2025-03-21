import express from "express";
import {
  addBackCoverPage,
  updateBackCoverPage,
  deleteBackCoverPage,
  upload
} from "../controllers/backCoverController.js";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes for index pages
router.post("/flipbook/:id/backcover", protectRoute, adminRoute, upload.single('image'), addBackCoverPage);
router.put("/flipbook/:flipbookId/backcover/:pageId", protectRoute, adminRoute, upload.single('image'), updateBackCoverPage);
router.delete("/flipbook/:flipbookId/backcover/:pageId", protectRoute, adminRoute, deleteBackCoverPage);

export default router;
