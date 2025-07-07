
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
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-primary text-white">
        <h3 className="mb-0">Analytics & Visualization</h3>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title text-primary mb-3">Habit Success Rates</h4>
                <ul className="list-group list-group-flush">
                  {habits.map((habit) => (
                    <li key={habit.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {habit.name}
                      <span className="badge bg-primary rounded-pill">
                        {calculateHabitSuccessRate(habit).toFixed(2)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title text-primary mb-3">Category Success Rates</h4>
                <ul className="list-group list-group-flush">
                  {categories.map((category) => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {category.name}
                      <span className="badge bg-success rounded-pill">
                        {calculateCategorySuccessRate(category.name).toFixed(2)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        

          <div className="row">
          <div className="col-12 mb-4">
            <StreakHeatmap habits={habits} categories={categories} />
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-4">
            <ProgressReports habits={habits} />
          </div>
          <div className="col-12 mb-4">
            <Badges earnedBadges={earnedBadges} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
