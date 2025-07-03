
import React from 'react';
import ProgressReports from './ProgressReports';
import StreakHeatmap from './StreakHeatmap';
import HabitCompletionChart from './HabitCompletionChart';
import Badges from './Badges';

const Analytics = ({ habits, categories, earnedBadges = [] }) => {
  const calculateHabitSuccessRate = (habit) => {
    if (!habit.history || habit.history.length === 0) {
      return 0;
    }

    const firstTrackedDate = new Date(habit.history[0].date);
    const today = new Date();
    const totalDays = Math.ceil((today - firstTrackedDate) / (1000 * 60 * 60 * 24)) + 1;

    const uniqueDates = new Set(habit.history.map(entry => new Date(entry.date).toDateString()));
    const completedDays = uniqueDates.size;

    return (completedDays / totalDays) * 100;
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
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-primary mb-3">Habit Completion Over Time</h4>
                {habits.map((habit) => (
                  <HabitCompletionChart key={habit.id} habit={habit} />
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-primary mb-3">Streak Heatmaps</h4>
                {habits.map((habit) => (
                  <StreakHeatmap key={habit.id} habit={habit} />
                ))}
              </div>
            </div>
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
