const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  category: String,
  history: [{ date: String, completions: {type: Number, default: 0} }],
  notes: [{ id: Number, text: String }],
  frequency: String,
  targetCompletions: {type: Number, default: 1},
  reminderTime: String,
});

module.exports = mongoose.model('Habit', HabitSchema);
