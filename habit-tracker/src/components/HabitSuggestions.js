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
    <div className="modern-card p-4 rounded-4 mb-5 border-dashed fade-in">
      <div className="d-flex align-items-center mb-3">
        <i className="bi bi-lightbulb-fill text-warning me-2 fs-5"></i>
        <h5 className="fw-bold mb-0">Need Inspiration?</h5>
      </div>
      <p className="text-muted small mb-3">Single click to add any of these popular habits to your list.</p>
      
      <div className="d-flex flex-wrap gap-2">
        {allSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="chip chip-success bg-white shadow-sm"
            onClick={() => addHabit(suggestion)}
          >
            <i className="bi bi-plus-circle me-2 opacity-50"></i>
            {suggestion.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitSuggestions;
