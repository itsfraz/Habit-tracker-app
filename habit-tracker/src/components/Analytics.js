
import React from 'react';
import ProgressReports from './ProgressReports';
import StreakHeatmap from './StreakHeatmap';

import Badges from './Badges';

const Analytics = ({ habits, categories, earnedBadges = [] }) => {
  const calculateHabitSuccessRate = (habit) => {
    if (!habit.history || habit.history.length === 0) {
      return 0;
    }

    let totalPossibleCompletions = 0;
    let actualCompletions = 0;

    habit.history.forEach(entry => {
      totalPossibleCompletions += habit.targetCompletions;
      actualCompletions += Math.min(entry.completions, habit.targetCompletions);
    });

    if (totalPossibleCompletions === 0) {
      return 0;
    }

    return (actualCompletions / totalPossibleCompletions) * 100;
  };

  const calculateCategorySuccessRate = (categoryName) => {
    const habitsInCategory = habits.filter(habit => habit.category === categoryName);
    if (habitsInCategory.length === 0) {
      return 0;
    }

    const totalSuccessRate = habitsInCategory.reduce((sum, habit) => sum + calculateHabitSuccessRate(habit), 0);
    return totalSuccessRate / habitsInCategory.length;
  };

  return (
    <div className="analytics-container fade-in">
      <div className="modern-card rounded-4 p-4 mb-4">
        <h3 className="section-title mb-4">Analytics & Visualization</h3>
        
        <div className="row g-4">
          <div className="col-md-6 mb-4">
            <div className="h-100 card border-0 shadow-sm rounded-4 bg-light overflow-hidden">
              <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                <h5 className="card-title text-primary fw-bold mb-0">Habit Success Rates</h5>
              </div>
              <div className="card-body px-4 pb-4">
                <ul className="list-group list-group-flush bg-transparent">
                  {habits.map((habit) => (
                    <li key={habit.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0 border-bottom-dashed">
                      <span className="fw-medium">{habit.name}</span>
                      <span className="badge bg-primary rounded-pill shadow-sm">
                        {calculateHabitSuccessRate(habit).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                  {habits.length === 0 && <p className="text-muted small">No habits to show yet.</p>}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="h-100 card border-0 shadow-sm rounded-4 bg-light overflow-hidden">
              <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                <h5 className="card-title text-primary fw-bold mb-0">Category Success Rates</h5>
              </div>
              <div className="card-body px-4 pb-4">
                <ul className="list-group list-group-flush bg-transparent">
                  {categories.map((category) => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0 border-bottom-dashed">
                      <span className="fw-medium">{category.name}</span>
                      <span className="badge bg-success rounded-pill shadow-sm">
                        {calculateCategorySuccessRate(category.name).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12 mb-4">
             <div className="modern-card p-3 rounded-4">
                <StreakHeatmap habits={habits} categories={categories} />
             </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-4">
            <ProgressReports habits={habits} />
          </div>
          <div className="col-12">
            <Badges earnedBadges={earnedBadges} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
