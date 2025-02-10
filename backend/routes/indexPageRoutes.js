import express from "express";
import { 
  addIndexPage, 
  updateIndexPage, 
  deleteIndexPage 
} from "../controllers/indexPageController.js";

const router = express.Router();


// Routes for index pages
router.post("/flipbook/:flipbookId/index", addIndexPage);
router.put("/flipbook/:flipbookId/index/:pageNumber", updateIndexPage);
router.delete("/flipbook/:flipbookId/index/:pageNumber", deleteIndexPage);

export default router; 