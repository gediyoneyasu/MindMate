const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const MoodLog = require('../models/MoodLog');

// Get today's mood
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const mood = await MoodLog.findOne({ userId: req.user.id, date: { $gte: today } });
    res.json(mood || null);
  } catch (error) {
    console.error('Error fetching today mood:', error);
    res.json(null);
  }
});

// Get all moods
router.get('/all', protect, async (req, res) => {
  try {
    const moods = await MoodLog.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.json([]);
  }
});

// Log mood
router.post('/log', protect, async (req, res) => {
  try {
    const { mood, intensity, factors, note } = req.body;
    const moodLog = new MoodLog({ 
      userId: req.user.id, 
      mood, 
      intensity: intensity || 3, 
      factors: factors || [], 
      note: note || '',
      date: new Date() 
    });
    await moodLog.save();
    res.status(201).json(moodLog);
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
