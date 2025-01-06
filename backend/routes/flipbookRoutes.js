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
} from "../controllers/flipbookController.js";

const router = express.Router();


// Page routes
router.get("/pages", getAllPages);
router.get("/pages/:pageNumber", getPageByNumber);
router.post("/pages/:flipbookId", createPage);
router.put("/:flipbookId/pages/:pageId", updatePage);
router.delete("/pages/:pageNumber", deletePage);
router.post("/", createFlipbook);
router.get("/:id", getFlipbookById);
// Archive routes
router.post("/archive/:flipbookId", archiveVersion);
router.get("/archive/:flipbookId", getArchivedVersions);
router.post("/publish/:flipbookId/:version", publishArchivedVersion);

export default router;
