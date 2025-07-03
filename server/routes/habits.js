const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

// @route   GET api/habits
// @desc    Get all habits for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/habits
// @desc    Add new habit
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, category, frequency, isTimeBased, targetDuration, reminderTime } = req.body;

  try {
    const newHabit = new Habit({
      user: req.user.id,
      name,
      category,
      frequency,
      isTimeBased,
      targetDuration,
      reminderTime,
    });

    const habit = await newHabit.save();
    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, category, frequency, isTimeBased, targetDuration, history, notes, reminderTime } = req.body;

  // Build habit object
  const habitFields = {};
  if (name) habitFields.name = name;
  if (category) habitFields.category = category;
  if (frequency) habitFields.frequency = frequency;
 
  if (targetDuration) habitFields.targetDuration = targetDuration;
  if (history) habitFields.history = history;
  if (notes) habitFields.notes = notes;
  if (reminderTime) habitFields.reminderTime = reminderTime;

  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) return res.status(404).json({ msg: 'Habit not found' });

    // Make sure user owns habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { $set: habitFields },
      { new: true }
    );

    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) return res.status(404).json({ msg: 'Habit not found' });

    // Make sure user owns habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Habit.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Habit removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
