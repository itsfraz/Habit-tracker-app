const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  category: String,
  history: [{ date: String, duration: Number }],
  notes: [{ id: Number, text: String }],
  frequency: String,
  isTimeBased: Boolean,
  targetDuration: Number,
  reminderTime: String,
});

module.exports = mongoose.model('Habit', HabitSchema);
