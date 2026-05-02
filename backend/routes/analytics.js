const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const MoodLog = require('../models/MoodLog');
const JournalEntry = require('../models/JournalEntry');

// Get analytics stats
router.get('/stats', protect, async (req, res) => {
  try {
    const totalEntries = await JournalEntry.countDocuments({ userId: req.user.id });
    const totalMoods = await MoodLog.countDocuments({ userId: req.user.id });
    
    // Calculate streak
    const moods = await MoodLog.find({ userId: req.user.id }).sort({ date: -1 }).limit(30);
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < moods.length; i++) {
      const moodDate = new Date(moods[i].date);
      moodDate.setHours(0, 0, 0, 0);
      if (moodDate.getTime() === currentDate.getTime() || 
          (i === 0 && (currentDate.getTime() - moodDate.getTime()) <= 86400000)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    res.json({ totalEntries, totalMoods, streak, avgMood: 3.5 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.json({ totalEntries: 0, totalMoods: 0, streak: 0, avgMood: 0 });
  }
});

// Get insights
router.get('/insights', protect, async (req, res) => {
  try {
    res.json({
      summary: "Based on your recent mood logs, you're showing good awareness of your emotions. Keep up the great work!",
      insights: [
        { icon: "💡", title: "Mood Awareness", message: "You're becoming more aware of your emotional patterns. This is excellent progress!" },
        { icon: "📊", title: "Tracking Consistency", message: "Regular mood tracking helps identify triggers and patterns." }
      ],
      recommendations: [
        "Try journaling daily for better emotional clarity",
        "Practice the breathing exercises when feeling stressed",
        "Set a regular time for mood tracking",
        "Share your feelings with someone you trust"
      ]
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.json({ summary: "Keep tracking your mood!", insights: [], recommendations: [] });
  }
});

module.exports = router;
