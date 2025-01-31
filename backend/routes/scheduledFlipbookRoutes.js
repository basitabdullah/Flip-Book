import express from "express";
import { 
  getScheduledFlipbooks, 
  scheduleFlipbook, 
  cancelScheduledFlipbook 
} from "../controllers/scheduledFlipbookController.js";

const router = express.Router();


// Get all scheduled flipbooks
router.get("/", getScheduledFlipbooks);

// Schedule a flipbook
router.post("/:flipbookId", scheduleFlipbook);

// Cancel a scheduled flipbook
router.delete("/:scheduleId", cancelScheduledFlipbook);

export default router; 