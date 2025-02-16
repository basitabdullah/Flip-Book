import express from "express";
import { 
  addCatalogPage, 
  updateCatalogPage, 
  deleteCatalogPage 
} from "../controllers/catalogController.js";

const router = express.Router();

router.post("/flipbook/:flipbookId/catalog", addCatalogPage);
router.put("/flipbook/:flipbookId/catalog/:pageId", updateCatalogPage);
router.delete("/flipbook/:flipbookId/catalog/:pageId", deleteCatalogPage);

export default router; 