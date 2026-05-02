const mongoose = require('mongoose');

const MoodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, enum: ['happy', 'calm', 'grateful', 'okay', 'sad', 'anxious', 'angry', 'tired'], required: true },
  intensity: { type: Number, min: 1, max: 5, default: 3 },
  factors: [{ type: String }],
  note: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoodLog', MoodLogSchema);
