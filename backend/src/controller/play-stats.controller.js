import { Song } from "../models/song.model.js";

export const getPlayStats = async (req, res, next) => {
  try {
    // Get top played songs of all time
    const topSongs = await Song.find()
      .sort({ totalPlays: -1 })
      .limit(5)
      .select('title artist imageUrl totalPlays');
    
    // Get weekly top songs
    const weeklyTopSongs = await Song.find()
      .sort({ weeklyPlays: -1 })
      .limit(5)
      .select('title artist imageUrl weeklyPlays');
    
    // Get monthly top songs
    const monthlyTopSongs = await Song.find()
      .sort({ monthlyPlays: -1 })
      .limit(5)
      .select('title artist imageUrl monthlyPlays');
    
    // Get yearly top songs
    const yearlyTopSongs = await Song.find()
      .sort({ yearlyPlays: -1 })
      .limit(5)
      .select('title artist imageUrl yearlyPlays');
    
    // Get total plays across all songs
    const totalPlaysResult = await Song.aggregate([
      {
        $group: {
          _id: null,
          totalPlays: { $sum: "$totalPlays" },
          weeklyPlays: { $sum: "$weeklyPlays" },
          monthlyPlays: { $sum: "$monthlyPlays" },
          yearlyPlays: { $sum: "$yearlyPlays" }
        }
      }
    ]);
    
    const totalPlaysStats = totalPlaysResult.length > 0 ? totalPlaysResult[0] : {
      totalPlays: 0,
      weeklyPlays: 0,
      monthlyPlays: 0,
      yearlyPlays: 0
    };
    
    // Get recently played songs
    const recentlyPlayed = await Song.find({ lastPlayed: { $ne: null } })
      .sort({ lastPlayed: -1 })
      .limit(5)
      .select('title artist imageUrl lastPlayed');
    
    res.json({
      topSongs,
      weeklyTopSongs,
      monthlyTopSongs,
      yearlyTopSongs,
      totalPlaysStats,
      recentlyPlayed
    });
  } catch (error) {
    next(error);
  }
};

// Add this function to reset weekly, monthly, yearly stats
export const resetPeriodicStats = async (req, res, next) => {
  try {
    const { period } = req.body;
    
    if (!['weekly', 'monthly', 'yearly'].includes(period)) {
      return res.status(400).json({ message: "Invalid period specified" });
    }
    
    const updateField = {};
    updateField[`${period}Plays`] = 0;
    
    await Song.updateMany({}, { $set: updateField });
    
    res.json({ 
      success: true, 
      message: `Reset ${period} play stats successfully` 
    });
  } catch (error) {
    next(error);
  }
};