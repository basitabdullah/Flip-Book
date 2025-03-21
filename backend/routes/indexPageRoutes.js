import express from "express";
import { 
  addIndexPage, 
  updateIndexPage, 
  deleteIndexPage 
} from "../controllers/indexPageController.js";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes for index pages
router.post("/flipbook/:flipbookId/index", protectRoute, adminRoute, addIndexPage);
router.put("/flipbook/:flipbookId/index/:pageNumber", protectRoute, adminRoute, updateIndexPage);
router.delete("/flipbook/:flipbookId/index/:pageNumber", protectRoute, adminRoute, deleteIndexPage);

export default router; 