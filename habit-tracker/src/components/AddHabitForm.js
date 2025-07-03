
import React, { useState } from 'react';

const AddHabitForm = ({ addHabit, categories, customSuggestedHabits }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [frequencyType, setFrequencyType] = useState('daily'); // 'daily', 'weekly', 'monthly', 'custom'
  const [customFrequencyCount, setCustomFrequencyCount] = useState(1);
  const [customFrequencyPeriod, setCustomFrequencyPeriod] = useState('week'); // 'week', 'month'
  const [isTimeBased, setIsTimeBased] = useState(false);
  const [targetDuration, setTargetDuration] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      let frequency = frequencyType;
      if (frequencyType === 'custom') {
        frequency = {
          type: 'custom',
          count: customFrequencyCount,
          period: customFrequencyPeriod,
        };
      }
      addHabit({ name, category, frequency, isTimeBased, targetDuration: isTimeBased ? targetDuration : 0 });
      setName('');
      setCategory('');
      setFrequencyType('daily');
      setCustomFrequencyCount(1);
      setCustomFrequencyPeriod('week');
      setIsTimeBased(false);
      setTargetDuration(0);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Add New Habit</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Habit Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <select
                className="form-select"
                value={frequencyType}
                onChange={(e) => setFrequencyType(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {frequencyType === 'custom' && (
              <div className="col-md-6 d-flex">
                <input
                  type="number"
                  className="form-control me-2"
                  value={customFrequencyCount}
                  onChange={(e) => setCustomFrequencyCount(parseInt(e.target.value) || 1)}
                  min="1"
                />
                <select
                  className="form-select"
                  value={customFrequencyPeriod}
                  onChange={(e) => setCustomFrequencyPeriod(e.target.value)}
                >
                  <option value="week">times/week</option>
                  <option value="month">times/month</option>
                </select>
              </div>
            )}
          </div>

          <div className="row g-3 mb-3 align-items-center">
            <div className="col-md-6">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="timeBasedSwitch"
                  checked={isTimeBased}
                  onChange={(e) => setIsTimeBased(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="timeBasedSwitch">
                  Time-based Habit
                </label>
              </div>
            </div>
            {isTimeBased && (
              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Target duration (minutes)"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12">
              <select
                className="form-select"
                value=""
                onChange={(e) => {
                  const selectedHabit = customSuggestedHabits.find(habit => habit.name === e.target.value);
                  if (selectedHabit) {
                    setName(selectedHabit.name);
                    setCategory(selectedHabit.category || '');
                    setFrequencyType(selectedHabit.frequency || 'daily');
                    setIsTimeBased(selectedHabit.isTimeBased || false);
                    setTargetDuration(selectedHabit.targetDuration || 0);
                  }
                }}
              >
                <option value="">Load from suggested habits</option>
                {customSuggestedHabits.map((habit, index) => (
                  <option key={index} value={habit.name}>
                    {habit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Add Habit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHabitForm;
