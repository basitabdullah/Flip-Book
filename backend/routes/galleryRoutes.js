import express from "express";
import { 
  addGalleryPage, 
  updateGalleryPage, 
  deleteGalleryPage 
} from "../controllers/galleryController.js";

const router = express.Router();


// Routes for gallery pages
router.post("/flipbook/:flipbookId/gallery", addGalleryPage);
router.put("/flipbook/:flipbookId/gallery/:pageNumber", updateGalleryPage);
router.delete("/flipbook/:flipbookId/gallery/:pageNumber", deleteGalleryPage);

export default router; 