import React, { useState } from 'react';
import Habit from './Habit';

const HabitList = ({ habits, deleteHabit, trackHabit, categories, addNote, setReminder }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter categories based on selection
  const filteredCategories = selectedCategory === 'All' 
    ? categories 
    : categories.filter(cat => cat.name === selectedCategory);

  const habitsByCategory = filteredCategories.map((category) => ({
    ...category,
    habits: habits.filter((habit) => habit.category === category.name),
  })).filter(cat => selectedCategory !== 'All' || cat.habits.length > 0); // Hide empty categories only if showing 'All'

  return (
    <div className="habit-list fade-in">
      {/* Category Filter Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0 text-dark">
          <i className="bi bi-collection-fill text-primary me-2"></i>
          Your Habits
        </h4>
        <div className="d-flex align-items-center">
            <span className="text-muted small me-2 d-none d-sm-block fw-bold text-uppercase">Filter by:</span>
            <select 
              className="form-select form-select-sm rounded-pill border-primary shadow-sm text-primary fw-bold" 
              style={{ width: 'auto', minWidth: '150px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
        </div>
      </div>

      {habitsByCategory.length === 0 && (
         <div className="text-center py-5">
           <div className="mb-3">
             <i className="bi bi-inbox fs-1 text-muted opacity-50"></i>
           </div>
           <p className="text-muted">No habits found in this category.</p>
         </div>
      )}

      {habitsByCategory.map((category) => (
        <div key={category.id} className="mb-5 fade-in">
          {selectedCategory === 'All' ? (
             <div className="d-flex align-items-center mb-3">
                <span className="badge rounded-pill px-3 py-2 me-2" style={{ backgroundColor: category.color || '#0d6efd' }}>
                  {category.name}
                </span>
                <div className="flex-grow-1 border-bottom border-light"></div>
             </div>
          ) : (
             <div className="mb-4 border-bottom pb-2">
                <h6 className="text-primary fw-bold mb-0">
                  <i className="bi bi-bookmark-star-fill me-2"></i>
                  {category.name}
                </h6>
             </div>
          )}
          
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {category.habits.map((habit) => (
              <div key={habit._id} className="col">
                <Habit
                  habit={habit}
                  deleteHabit={deleteHabit}
                  trackHabit={trackHabit}
                  addNote={addNote}
                  categories={categories}
                  setReminder={setReminder}
                />
              </div>
            ))}
          </div>
          {category.habits.length === 0 && selectedCategory !== 'All' && (
             <p className="text-muted small fst-italic">No habits added to {category.name} yet.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default HabitList;
