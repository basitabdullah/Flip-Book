import express from "express";
import {
  getAllPages,
  getPageByNumber,
  createPage,
  updatePage,
  deletePage,
  getFlipbookById,
  createFlipbook,
  publishFlipbook,
  getPublishedFlipbook,
  getAllPublishedFlipbooks,
  togglePublishedFlipbook,
  updatePublishedFlipbook,
  deletePublishedFlipbook,
  getAllFlipbooks,
  deleteFlipbook,
} from "../controllers/flipbookController.js";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Page routes (Admin only)
router.get("/pages", protectRoute, adminRoute, getAllPages);
router.get("/pages/:pageNumber", protectRoute, adminRoute, getPageByNumber);
router.post("/pages/:flipbookId", protectRoute, adminRoute, createPage);
router.put("/:flipbookId/pages/:pageId", protectRoute, adminRoute, updatePage);
router.delete("/pages/:pageId", protectRoute, adminRoute, deletePage);

// Flipbook routes (Admin only)
router.post("/createflipbook", protectRoute, adminRoute, createFlipbook);
router.get("/singleflipbook/:id", protectRoute, adminRoute, getFlipbookById);
router.get('/allflipbooks', protectRoute, adminRoute, getAllFlipbooks);
router.delete("/:flipbookId", protectRoute, adminRoute, deleteFlipbook);

// Publish Routes (Mixed access)
router.post("/instantpublish/:flipbookId", protectRoute, adminRoute, publishFlipbook);
router.get("/published/get-published-flipbook/:flipbookId", getPublishedFlipbook); // Public access
router.get("/published/get-published-flipbooks", getAllPublishedFlipbooks); // Public access
router.get("/published/toggle-published/:flipbookId", protectRoute, adminRoute, togglePublishedFlipbook);
router.put("/published/:flipbookId/pages/:pageId", protectRoute, adminRoute, updatePublishedFlipbook);
router.delete("/published/:flipbookId", protectRoute, adminRoute, deletePublishedFlipbook);

export default router;