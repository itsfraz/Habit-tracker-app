import React, { useState } from 'react';

const AddHabitForm = ({ addHabit, categories, customSuggestedHabits }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [frequencyType, setFrequencyType] = useState('daily');
  const [customFrequencyCount, setCustomFrequencyCount] = useState(1);
  const [customFrequencyPeriod, setCustomFrequencyPeriod] = useState('week');
  const [targetCompletions, setTargetCompletions] = useState(1);

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
      addHabit({ name, category, frequency, targetCompletions });
      setName('');
      setCategory('');
      setFrequencyType('daily');
      setCustomFrequencyCount(1);
      setCustomFrequencyPeriod('week');
      setTargetCompletions(1);
    }
  };

  return (
    <div className="modern-card p-3 rounded-4 fade-in">
      <h5 className="fw-bold mb-3 text-primary">
        <i className="bi bi-plus-circle-fill me-2"></i>
        New Habit
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-3">
          
          {/* Quick Load Suggestions */}
          <div>
            <select
              className="form-select form-select-sm rounded-3 bg-light border-0 text-muted"
              onChange={(e) => {
                const selectedHabit = customSuggestedHabits.find(habit => habit.name === e.target.value);
                if (selectedHabit) {
                  setName(selectedHabit.name);
                  setCategory(selectedHabit.category || '');
                  setFrequencyType(selectedHabit.frequency || 'daily');
                  setTargetCompletions(selectedHabit.targetCompletions || 1);
                }
              }}
              value=""
            >
              <option value="">✨ Quick Templates...</option>
              {customSuggestedHabits.map((habit, index) => (
                <option key={index} value={habit.name}>
                  {habit.name}
                </option>
              ))}
            </select>
          </div>

          {/* Habit Name */}
          <div className="form-floating">
            <input
              type="text"
              className="form-control form-control-sm rounded-3"
              id="habitName"
              placeholder="Habit Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="habitName" className="small text-muted">Habit Name</label>
          </div>

          {/* Category */}
          <div className="form-floating">
            <select
              className="form-select form-select-sm rounded-3"
              id="habitCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
             <label htmlFor="habitCategory" className="small text-muted">Category</label>
          </div>

          {/* Frequency */}
          <div className="row g-2">
             <div className="col-12">
               <div className="form-floating">
                <select
                  className="form-select form-select-sm rounded-3"
                  id="frequencyType"
                  value={frequencyType}
                  onChange={(e) => setFrequencyType(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
                 <label htmlFor="frequencyType" className="small text-muted">Frequency</label>
              </div>
             </div>
             
             {/* Custom Frequency Detail */}
             {frequencyType === 'custom' && (
               <div className="col-12">
                 <div className="input-group input-group-sm">
                    <input
                      type="number"
                      className="form-control"
                      value={customFrequencyCount}
                      onChange={(e) => setCustomFrequencyCount(parseInt(e.target.value) || 1)}
                      min="1"
                      placeholder="#"
                    />
                    <select
                      className="form-select"
                      value={customFrequencyPeriod}
                      onChange={(e) => setCustomFrequencyPeriod(e.target.value)}
                    >
                      <option value="week">/ Week</option>
                      <option value="month">/ Month</option>
                    </select>
                 </div>
               </div>
             )}
          </div>

          {/* Daily Goal */}
           <div className="form-floating">
            <input
              type="number"
              className="form-control form-control-sm rounded-3"
               id="targetCompletions"
              value={targetCompletions}
              onChange={(e) => setTargetCompletions(parseInt(e.target.value) || 1)}
              min="1"
            />
            <label htmlFor="targetCompletions" className="small text-muted">Daily Goal</label>
          </div>

          {/* Submit Button */}
          <button className="btn btn-primary bg-gradient-primary w-100 py-2 rounded-3 shadow-sm fw-bold mt-2" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHabitForm;
