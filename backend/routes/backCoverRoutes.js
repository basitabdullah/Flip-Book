import express from "express";
import {
  addBackCoverPage,
  updateBackCoverPage,
  deleteBackCoverPage,
  upload
} from "../controllers/backCoverController.js";

const router = express.Router();

// Routes for index pages
router.post("/flipbook/:id/backcover", upload.single('image'), addBackCoverPage);
router.put("/flipbook/:flipbookId/backcover/:pageId", upload.single('image'), updateBackCoverPage);
router.delete("/flipbook/:flipbookId/backcover/:pageId", deleteBackCoverPage);

export default router;
