import mongoose from "mongoose";

const scheduledFlipbookSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  issue: { 
    type: String, 
    required: true 
  },
  flipbook: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Flipbook",
    required: true 
  },
  scheduledDate: { 
    type: Date, 
    required: true 
  },
  status: {
    type: String,
    enum: ['scheduled', 'published', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const ScheduledFlipbook = mongoose.model("ScheduledFlipbook", scheduledFlipbookSchema); 