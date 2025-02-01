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
  getAllFlipbooks
} from "../controllers/flipbookController.js";

const router = express.Router();


// Page routes
router.get("/pages", getAllPages);
router.get("/pages/:pageNumber", getPageByNumber);
router.post("/pages/:flipbookId", createPage);
router.put("/:flipbookId/pages/:pageId", updatePage);
router.delete("/pages/:pageId", deletePage);

// Flipbook routes
router.post("/", createFlipbook);
router.get("/:id", getFlipbookById);
router.get('/flipbooks', getAllFlipbooks);

//Publish Routes
router.post("/instantpublish/:flipbookId", publishFlipbook);
router.get("/published/get-published-flipbook/:flipbookId", getPublishedFlipbook);
router.get("/published/get-published-flipbooks", getAllPublishedFlipbooks);
router.get("/published/toggle-published/:flipbookId", togglePublishedFlipbook);
router.put("/published/:flipbookId/pages/:pageId", updatePublishedFlipbook);
router.delete("/published/:flipbookId", deletePublishedFlipbook);


export default router;
