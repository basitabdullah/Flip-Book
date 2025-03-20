import express from "express";
import { 
  addCatalogPage, 
  updateCatalogPage, 
  deleteCatalogPage,
  upload
} from "../controllers/catalogController.js";

const router = express.Router();

router.post("/flipbook/:flipbookId/catalog", upload.array('images'), addCatalogPage);
router.put("/flipbook/:flipbookId/catalog/:pageId", upload.array('images'), updateCatalogPage);
router.delete("/flipbook/:flipbookId/catalog/:pageId", deleteCatalogPage);

export default router; 