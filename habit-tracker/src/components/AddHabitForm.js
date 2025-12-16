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
    <div className="modern-card p-4 rounded-4 fade-in">
      <div className="d-flex align-items-center mb-4 text-primary">
         <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
            <i className="bi bi-plus-lg fs-5"></i>
         </div>
         <h5 className="fw-bold mb-0">Create New Habit</h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-4">
          
          {/* Quick Load Suggestions */}
          <div>
            <label className="form-label text-uppercase text-muted fw-bold small-tracking mb-2" style={{ fontSize: '0.7rem' }}>Quick Start</label>
            <div className="position-relative">
                <select
                  className="form-select border-0 bg-light fw-medium text-dark py-2 ps-3 pe-5"
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
                  style={{ borderRadius: '12px', cursor: 'pointer' }}
                >
                  <option value="">Choose a template...</option>
                  {customSuggestedHabits.map((habit, index) => (
                    <option key={index} value={habit.name}>
                      {habit.name}
                    </option>
                  ))}
                </select>
                <div className="position-absolute top-50 end-0 translate-middle-y me-3 pe-none text-muted">
                    <i className="bi bi-stars"></i>
                </div>
            </div>
          </div>

          {/* Habit Name */}
          <div>
            <label htmlFor="habitName" className="form-label text-uppercase text-muted fw-bold small-tracking mb-1" style={{ fontSize: '0.7rem' }}>Habit Name</label>
            <input
              type="text"
              className="form-control form-control-lg border-light bg-light fw-bold text-dark px-3"
              id="habitName"
              placeholder="e.g., Morning Run"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ borderRadius: '12px' }}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="habitCategory" className="form-label text-uppercase text-muted fw-bold small-tracking mb-1" style={{ fontSize: '0.7rem' }}>Category</label>
            <select
              className="form-select form-select-lg border-light bg-light fw-medium text-dark px-3"
              id="habitCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{ borderRadius: '12px' }}
            >
              <option value="">Select Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency & Goal Row */}
          <div className="row g-3">
             <div className="col-12">
               <label className="form-label text-uppercase text-muted fw-bold small-tracking mb-1" style={{ fontSize: '0.7rem' }}>Frequency</label>
                <select
                  className="form-select border-light bg-light fw-medium text-dark"
                  value={frequencyType}
                  onChange={(e) => setFrequencyType(e.target.value)}
                  style={{ borderRadius: '12px', padding: '0.75rem 1rem' }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
             </div>
             
             {/* Custom Frequency Detail */}
             {frequencyType === 'custom' && (
               <div className="col-12 fade-in">
                 <div className="input-group">
                    <input
                      type="number"
                      className="form-control bg-light border-light"
                      value={customFrequencyCount}
                      onChange={(e) => setCustomFrequencyCount(parseInt(e.target.value) || 1)}
                      min="1"
                      style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}
                    />
                    <select
                      className="form-select bg-light border-light"
                      value={customFrequencyPeriod}
                      onChange={(e) => setCustomFrequencyPeriod(e.target.value)}
                      style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}
                    >
                      <option value="week">times / week</option>
                      <option value="month">times / month</option>
                    </select>
                 </div>
               </div>
             )}

             <div className="col-12">
                <label className="form-label text-uppercase text-muted fw-bold small-tracking mb-1" style={{ fontSize: '0.7rem' }}>Daily Target</label>
                <div className="d-flex align-items-center bg-light rounded-4 px-3 py-2">
                    <button 
                        type="button" 
                        className="btn btn-sm btn-link text-decoration-none text-muted p-0"
                        onClick={() => setTargetCompletions(Math.max(1, targetCompletions - 1))}
                    >
                        <i className="bi bi-dash-circle fs-4"></i>
                    </button>
                    <input
                      type="number"
                      className="form-control border-0 bg-transparent text-center fw-bold fs-5 p-0 mx-2"
                      value={targetCompletions}
                      onChange={(e) => setTargetCompletions(parseInt(e.target.value) || 1)}
                      min="1"
                    />
                    <button 
                        type="button" 
                        className="btn btn-sm btn-link text-decoration-none text-primary p-0"
                        onClick={() => setTargetCompletions(targetCompletions + 1)}
                    >
                        <i className="bi bi-plus-circle-fill fs-4"></i>
                    </button>
                </div>
             </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary bg-gradient w-100 py-3 rounded-4 shadow-sm fw-bold mt-2 letter-spacing-1 d-flex align-items-center justify-content-center gap-2"
            style={{ transition: 'all 0.2s' }}
          >
            <i className="bi bi-check-lg"></i>
            Create Habit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHabitForm;
