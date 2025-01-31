import cron from 'node-cron';
import { ScheduledFlipbook } from '../models/scheduledFlipbookModel.js';
import { PublishedFlipbook } from '../models/publishedFlipbookModel.js';

// Run every minute to check for flipbooks that need to be published
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    
    // Find all scheduled flipbooks that should be published
    const scheduledFlipbooks = await ScheduledFlipbook.find({
      scheduledDate: { $lte: now },
      status: 'scheduled'
    }).populate('flipbook');

    for (const scheduled of scheduledFlipbooks) {
      try {
        // Create published flipbook
        const publishedFlipbook = new PublishedFlipbook({
          name: scheduled.name,
          issue: scheduled.issue,
          flipbook: scheduled.flipbook._id,
          pages: scheduled.flipbook.pages,
          publishedAt: now,
          isPublished: true
        });

        await publishedFlipbook.save();

        // Update scheduled flipbook status
        scheduled.status = 'published';
        await scheduled.save();

        console.log(`Successfully published scheduled flipbook: ${scheduled.name}`);
      } catch (error) {
        console.error(`Error publishing scheduled flipbook ${scheduled._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in scheduler service:', error);
  }
}); 