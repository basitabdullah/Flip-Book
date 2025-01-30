import express from "express";
import {
  getAllPages,
  getPageByNumber,
  createPage,
  updatePage,
  deletePage,
  archiveVersion,
  getArchivedVersions,
  publishArchivedVersion,
  getFlipbookById,
  createFlipbook,
  getArchivedVersionById,
  publishFlipbook,
  getPublishedFlipbook,
  getAllPublishedFlipbooks,
  togglePublishedFlipbook,
  updatePublishedFlipbook,
  deletePublishedFlipbook
} from "../controllers/flipbookController.js";

const router = express.Router();


// Page routes
router.get("/pages", getAllPages);
router.get("/pages/:pageNumber", getPageByNumber);
router.post("/pages/:flipbookId", createPage);
router.put("/:flipbookId/pages/:pageId", updatePage);
router.delete("/pages/:pageId", deletePage);
router.post("/", createFlipbook);
router.get("/:id", getFlipbookById);
// Archive routes
router.post("/archive/:flipbookId", archiveVersion);//create an archived version
router.get("/archive/:flipbookId", getArchivedVersions); //get all archived versions
router.get("/singleArchive/:archiveId", getArchivedVersionById);

router.post("/publish/:flipbookId/:version", publishArchivedVersion);
router.post("/instantpublish/:flipbookId", publishFlipbook);
router.get("/published/get-published-flipbook/:flipbookId", getPublishedFlipbook);
router.get("/published/get-published-flipbooks", getAllPublishedFlipbooks);
router.get("/published/toggle-published/:flipbookId", togglePublishedFlipbook);
router.put("/published/:flipbookId/pages/:pageId", updatePublishedFlipbook);
router.delete("/published/:flipbookId", deletePublishedFlipbook);

export default router;
