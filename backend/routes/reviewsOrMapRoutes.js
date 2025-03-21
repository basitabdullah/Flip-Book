import express from "express";
import { 
  createReviewsOrMapPage, 
  updateReviewsOrMapPage, 
  deleteReviewsOrMapPage 
} from "../controllers/reviewsOrMapController.js";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes for reviews/map pages
router.post("/flipbook/:flipbookId/reviews-map", protectRoute, adminRoute, createReviewsOrMapPage);
router.put("/flipbook/:flipbookId/reviews-map/:pageId", protectRoute, adminRoute, updateReviewsOrMapPage);
router.delete("/flipbook/:flipbookId/reviews-map/:pageId", protectRoute, adminRoute, deleteReviewsOrMapPage);

export default router; 