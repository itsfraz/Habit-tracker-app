import React, { useState, useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const StreakHeatmap = ({ habits, categories }) => {
  const today = new Date();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [hoveredValue, setHoveredValue] = useState(null);

  // Generate color scale for heatmap
  const colorScale = [
    '#f3f4f6', // 0: Empty
    '#dcfce7', // 1: Very Low
    '#86efac', // 2: Low
    '#4ade80', // 3: Medium
    '#22c55e', // 4: High
    '#15803d'  // 5: Very High
  ];

  const filteredHabits = useMemo(() => {
    if (selectedCategory === '') return habits;
    return habits.filter(habit => habit.category === selectedCategory);
  }, [habits, selectedCategory]);

  const getValuesForHeatmap = useMemo(() => {
    const dailyCompletions = {};

    filteredHabits.forEach(habit => {
      habit.history.forEach(entry => {
        const date = entry.date; // YYYY-MM-DD
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

    
    // We only strictly need values for valid dates, react-calendar-heatmap fills the rest with 'null' or empty.
    // However, pre-calculating makes it robust.
    for (const dateString in dailyCompletions) {
        // Filter by year roughly
        if (dateString.startsWith(String(selectedYear))) {
             const { completed, target } = dailyCompletions[dateString];
             // Intensity ratio 0 to 1
             const ratio = target > 0 ? Math.min(completed / target, 1) : 0;
             values.push({
                 date: dateString,
                 count: ratio, // 0.0 to 1.0
                 details: { completed, target }
             });
        }
    }
    return values;
  }, [filteredHabits, selectedYear]);

  return (
    <div className="d-flex flex-column h-100 w-100 position-relative">
        {/* Header & Controls */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 gap-3">
            <div className="d-flex align-items-center gap-2">
                <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="bi bi-calendar3-range fs-5"></i>
                </div>
                <div>
                   <h5 className="fw-bold mb-0 text-dark">Activity Intensity</h5>
                   <small className="text-muted">Visualizing your daily consistency</small>
                </div>
            </div>

            <div className="d-flex gap-2">
                 <select
                    className="form-select form-select-sm rounded-pill border-0 bg-light fw-semibold text-secondary shadow-sm"
                    style={{ minWidth: '140px' }}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
                
                <select
                    className="form-select form-select-sm rounded-pill border-0 bg-light fw-semibold text-secondary shadow-sm"
                    style={{ width: 'auto' }}
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                   {[today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map(y => (
                       <option key={y} value={y}>{y}</option>
                   ))}
                </select>
            </div>
        </div>

        {/* Heatmap Container */}
        <div className="position-relative flex-grow-1 w-100 heatmap-scroll-container">
            <style>
                {`
                .heatmap-scroll-container {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    padding-bottom: 10px;
                }
                .react-calendar-heatmap {
                    width: 100%;
                    min-width: 600px; /* Ensure it doesn't squish too much */
                }
                .react-calendar-heatmap text {
                    font-size: 10px;
                    fill: #adb5bd;
                    font-weight: 600;
                }
                .react-calendar-heatmap rect {
                    rx: 3px;
                    ry: 3px;
                    stroke: #fff;
                    stroke-width: 2px;
                    transition: transform 0.2s, fill 0.2s;
                }
                .react-calendar-heatmap rect:hover {
                    stroke: rgba(0,0,0,0.1);
                }
                
                /* Color Scales */
                .color-empty { fill: ${colorScale[0]}; }
                .color-scale-1 { fill: ${colorScale[1]}; }
                .color-scale-2 { fill: ${colorScale[2]}; }
                .color-scale-3 { fill: ${colorScale[3]}; }
                .color-scale-4 { fill: ${colorScale[4]}; }
                .color-scale-5 { fill: ${colorScale[5]}; }
                `}
            </style>
            
            <CalendarHeatmap
                startDate={new Date(selectedYear, 0, 1)}
                endDate={new Date(selectedYear, 11, 31)}
                values={getValuesForHeatmap}
                classForValue={(value) => {
                    if (!value || value.count === 0) return 'color-empty';
                    return `color-scale-${Math.ceil(value.count * 5)}`;
                }}
                showWeekdayLabels={true}
                gutterSize={0} // Handled by stroke
                onMouseOver={(event, value) => setHoveredValue({ value, event })}
                onMouseLeave={() => setHoveredValue(null)}
                // Mobile tap support could be added via onClick/onTouchStart if needed, reusing hover logic
            />
            
            {/* Custom Tooltip Overlay */}
            {hoveredValue && hoveredValue.value && (
                <div 
                    className="position-absolute bg-dark text-white p-2 rounded shadow-sm text-center pointer-events-none"
                    style={{ 
                        zIndex: 100,
                        fontSize: '0.75rem',
                        top: 0, // Simplified positioning (can be improved with Popper.js if library available, else relative top/right in layout)
                        right: 0,
                        pointerEvents: 'none',
                        transition: 'opacity 0.2s'
                    }}
                >
                    <div className="fw-bold">{hoveredValue.value.date}</div>
                    <div>{Math.round(hoveredValue.value.count * 100)}% Activity</div>
                    {hoveredValue.value.details && (
                        <div className="small text-white-50">
                            {hoveredValue.value.details.completed} / {hoveredValue.value.details.target} Goals
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Legend */}
        <div className="d-flex align-items-center justify-content-end gap-2 mt-2 small text-muted">
            <span className="fw-semibold" style={{ fontSize: '0.7rem' }}>Less</span>
            <div className="d-flex gap-1" style={{ height: '14px' }}>
                {colorScale.map((color, idx) => (
                    <div 
                        key={idx} 
                        className="rounded-1" 
                        style={{ width: '14px', height: '100%', backgroundColor: color }}
                        title={`Level ${idx}`}
                    ></div>
                ))}
            </div>
            <span className="fw-semibold" style={{ fontSize: '0.7rem' }}>More</span>
        </div>
    </div>
  );
};

export default StreakHeatmap;