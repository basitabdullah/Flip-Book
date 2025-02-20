import express from "express";
import { 
  createReviewsOrMapPage, 
  updateReviewsOrMapPage, 
  deleteReviewsOrMapPage 
} from "../controllers/reviewsOrMapController.js";

const router = express.Router();

// Routes for reviews/map pages
router.post("/flipbook/:flipbookId/reviews-map", createReviewsOrMapPage);
router.put("/flipbook/:flipbookId/reviews-map/:pageId", updateReviewsOrMapPage);
router.delete("/flipbook/:flipbookId/reviews-map/:pageId", deleteReviewsOrMapPage);

export default router; 