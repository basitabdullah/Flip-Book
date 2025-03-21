import express from "express";
import { 
  addGalleryPage, 
  updateGalleryPage, 
  deleteGalleryPage 
} from "../controllers/galleryController.js";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes for gallery pages
router.post("/flipbook/:flipbookId/gallery", protectRoute, adminRoute, addGalleryPage);
router.put("/flipbook/:flipbookId/gallery/:pageId", protectRoute, adminRoute, updateGalleryPage);
router.delete("/flipbook/:flipbookId/gallery/:pageId", protectRoute, adminRoute, deleteGalleryPage);

export default router; 