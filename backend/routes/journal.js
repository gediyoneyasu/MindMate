const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const JournalEntry = require('../models/JournalEntry');

// Get recent entries
router.get('/recent', protect, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching recent entries:', error);
    res.json([]);
  }
});

// Get all entries
router.get('/', protect, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.json([]);
  }
});

// Create entry
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    const entry = new JournalEntry({ 
      userId: req.user.id, 
      title, 
      content, 
      mood, 
      tags 
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete entry
router.delete('/:id', protect, async (req, res) => {
  try {
    await JournalEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
