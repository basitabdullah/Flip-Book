import express from "express";
import { 
  addSocialPage, 
  updateSocialPage, 
  deleteSocialPage 
} from "../controllers/socialController.js";

const router = express.Router();

// Routes for social pages
router.post("/flipbook/:flipbookId/social", addSocialPage);
router.put("/flipbook/:flipbookId/social/:pageId", updateSocialPage);
router.delete("/flipbook/:flipbookId/social/:pageId", deleteSocialPage);

export default router; 