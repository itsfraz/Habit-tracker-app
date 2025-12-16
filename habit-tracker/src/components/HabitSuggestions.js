import React from 'react';

const suggestedHabits = [
  { name: 'Drink 8 glasses of water', category: 'Health', frequency: 'daily' },
  { name: 'Read for 30 minutes', category: 'Personal', frequency: 'daily' },
  { name: 'Exercise for 20 minutes', category: 'Health', frequency: 'daily' },
  { name: 'Meditate for 10 minutes', category: 'Personal', frequency: 'daily' },
  { name: 'Plan your day', category: 'Work', frequency: 'daily' },
];

const HabitSuggestions = ({ habits, addHabit, customSuggestedHabits }) => {
  const allSuggestions = [...suggestedHabits, ...customSuggestedHabits];

  const showSuggestions = habits.length < 5; // Relaxed condition to show more often

  if (!showSuggestions) {
    return null;
  }

  return (
    <div className="modern-card p-4 rounded-4 mb-4 fade-in">
      <div className="d-flex align-items-center mb-3 text-warning">
        <i className="bi bi-lightbulb-fill me-2 fs-5"></i>
        <h6 className="fw-bold mb-0 text-dark">Need Inspiration?</h6>
      </div>
      
      <div className="d-flex flex-wrap gap-2">
        {allSuggestions.map((suggestion, index) => (
          <button
            key={index}
            className="btn btn-sm btn-light border-0 rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm hover-primary transition-all"
            onClick={() => addHabit(suggestion)}
            style={{ fontSize: '0.85rem' }}
          >
            <i className="bi bi-plus-circle text-primary opacity-50"></i>
            <span className="fw-medium text-dark">{suggestion.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HabitSuggestions;
