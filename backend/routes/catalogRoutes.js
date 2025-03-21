import express from "express";
import { 
  addCatalogPage, 
  updateCatalogPage, 
  deleteCatalogPage,
  upload
} from "../controllers/catalogController.js";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/flipbook/:flipbookId/catalog", protectRoute, adminRoute, upload.array('images'), addCatalogPage);
router.put("/flipbook/:flipbookId/catalog/:pageId", protectRoute, adminRoute, upload.array('images'), updateCatalogPage);
router.delete("/flipbook/:flipbookId/catalog/:pageId", protectRoute, adminRoute, deleteCatalogPage);

export default router; 