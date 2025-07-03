
import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const StreakHeatmap = ({ habit }) => {
  const today = new Date();
  const endDate = today;
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);

  const values = habit.history.map((entry) => ({
    date: new Date(entry.date),
    count: 1,
  }));

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h5 className="card-title text-primary mb-3">{habit.name} Streak Heatmap</h5>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-1`;
          }}
        />
      </div>
    </div>
  );
};

export default StreakHeatmap;
