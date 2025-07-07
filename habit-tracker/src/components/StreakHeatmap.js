import React, { useState, useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const StreakHeatmap = ({ habits, categories }) => {
  const today = new Date();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      yearsArray.push(i);
    }
    return yearsArray;
  }, []);

  const filteredHabits = useMemo(() => {
    if (selectedCategory === '') {
      return habits;
    }
    return habits.filter(habit => habit.category === selectedCategory);
  }, [habits, selectedCategory]);

  const getValuesForHeatmap = useMemo(() => {
    const dailyCompletions = {};

    filteredHabits.forEach(habit => {
      habit.history.forEach(entry => {
        const date = entry.date;
        const completions = entry.completions || 0;
        const target = habit.targetCompletions || 1;

        if (!dailyCompletions[date]) {
          dailyCompletions[date] = { completed: 0, target: 0 };
        }
        dailyCompletions[date].completed += completions;
        dailyCompletions[date].target += target;
      });
    });

    const values = [];
    for (const dateString in dailyCompletions) {
      const { completed, target } = dailyCompletions[dateString];
      const ratio = target > 0 ? Math.min(completed / target, 1) : 0;
      values.push({
        date: dateString,
        count: ratio,
      });
    }
    return values;
  }, [filteredHabits]);

  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
  const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

  // Inline styles for the heatmap
  const styles = {
    heatmapContainer: {
      overflowX: 'auto',
      padding: '5px',
    },
    heatmap: {
      height: 'auto',
      fontSize: '10px',
    },
    heatmapText: {
      fontSize: '8px',
      fill: '#767676',
    },
    heatmapSmallText: {
      fontSize: '5px',
    },
  };

 return (
    <div className="card shadow-sm mt-4">
      <div className="card-body p-2"> {/* Reduced padding */}
        <h5 className="card-title text-primary mb-2" style={{ fontSize: '0.9rem' }}>Streak Heatmap</h5>
        <div className="row mb-3">
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ 
          overflowX: 'auto',
          padding: '2px',
          width: '100%',
          maxWidth: '120px', // Constrain maximum width
          margin: '0 auto' // Center the heatmap
        }}>
          <style>
            {`
              .react-calendar-heatmap {
                font-size: 6px;
              }
              .react-calendar-heatmap .color-empty {
                fill: #ebedf0;
                rx: 1px;
                ry: 1px;
              }
              .react-calendar-heatmap .color-scale-1 { fill: #9be9a8; }
              .react-calendar-heatmap .color-scale-2 { fill: #40c463; }
              .react-calendar-heatmap .color-scale-3 { fill: #30a14e; }
              .react-calendar-heatmap .color-scale-4 { fill: #216e39; }
              .react-calendar-heatmap .color-scale-5 { fill: #144d25; }
              .react-calendar-heatmap rect {
                width: 8px;
                height: 8px;
                rx: 1px;
                ry: 1px;
              }
              .react-calendar-heatmap text {
                font-size: 6px;
                fill: #767676;
              }
              .react-calendar-heatmap rect:hover {
                stroke: #555;
                stroke-width: 0.5px;
              }
            `}
          </style>
          <CalendarHeatmap
            startDate={firstDayOfMonth}
            endDate={lastDayOfMonth}
            values={getValuesForHeatmap}
            classForValue={(value) => {
              if (!value || value.count === 0) return 'color-empty';
              return `color-scale-${Math.ceil(value.count * 5)}`;
            }}
            showWeekdayLabels={true}
            gutterSize={1}  // Minimal gap between squares
            squareSize={8}  // Very small squares
            horizontal={true}
          />
        </div>
      </div>
    </div>
  );
};

export default StreakHeatmap;