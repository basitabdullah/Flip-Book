import { ScheduledFlipbook } from "../models/scheduledFlipbookModel.js";
import { Flipbook } from "../models/flipbookModel.js";

// Get all scheduled flipbooks
export const getScheduledFlipbooks = async (req, res) => {
  try {
    const scheduledFlipbooks = await ScheduledFlipbook.find({
      status: 'scheduled' // Only get flipbooks that haven't been published yet
    }).populate('flipbook');

    res.status(200).json(scheduledFlipbooks);
  } catch (error) {
    console.error("Error getting scheduled flipbooks:", error);
    res.status(500).json({ message: error.message });
  }
};

// Schedule a flipbook for publishing
export const scheduleFlipbook = async (req, res) => {
  const { name, issue, scheduledDate } = req.body;
  const { flipbookId } = req.params;

  try {
    // Validate flipbook exists
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Validate scheduled date is in the future
    const scheduleTime = new Date(scheduledDate);
    if (scheduleTime <= new Date()) {
      return res.status(400).json({ message: "Scheduled time must be in the future" });
    }

    // Create scheduled flipbook entry
    const newScheduledFlipbook = new ScheduledFlipbook({
      name,
      issue,
      flipbook: flipbookId,
      scheduledDate: scheduleTime,
      status: 'scheduled'
    });

    const savedSchedule = await newScheduledFlipbook.save();

    // Populate the flipbook data before sending response
    const populatedSchedule = await ScheduledFlipbook.findById(savedSchedule._id)
      .populate('flipbook');

    res.status(201).json(populatedSchedule);
  } catch (error) {
    console.error("Error scheduling flipbook:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cancel a scheduled flipbook
export const cancelScheduledFlipbook = async (req, res) => {
  const { scheduleId } = req.params;

  try {
    const deletedSchedule = await ScheduledFlipbook.findByIdAndDelete(scheduleId);
    
    if (!deletedSchedule) {
      return res.status(404).json({ message: "Scheduled flipbook not found" });
    }

    res.status(200).json({ message: "Schedule cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling schedule:", error);
    res.status(500).json({ message: error.message });
  }
}; 