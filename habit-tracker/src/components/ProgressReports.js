import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressReports = ({ habits, theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [timeRange, setTimeRange] = useState('ALL'); // ALL, YEAR, 30_DAYS
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    
    const ctx = chart.ctx;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
    // Premium Purple-Blue Gradient
    gradientFill.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    gradientFill.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
    setGradient(gradientFill);
  }, [timeRange]); // Re-create if needed, though canvas ref is stable

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    let totalCompletions = 0;
    let bestDayCount = 0;
    
    // Flatten history
    const allEntries = habits.flatMap(h => h.history);
    const dailyMap = {};
    
    allEntries.forEach(e => {
       totalCompletions += (e.completions || 0);
       const d = e.date;
       dailyMap[d] = (dailyMap[d] || 0) + (e.completions || 0);
       if (dailyMap[d] > bestDayCount) bestDayCount = dailyMap[d];
    });

    const activeHabits = habits.length;

    return { totalCompletions, bestDayCount, activeHabits };
  }, [habits]);


  // --- Chart Data Preparation ---
  const chartData = useMemo(() => {
    const dailyData = {};
    const allEntries = habits.flatMap(h => h.history).sort((a,b) => new Date(a.date) - new Date(b.date));
    
    if (allEntries.length === 0) return { labels: [], datasets: [] };

    // Filter based on Time Range
    const now = new Date();
    let cutoffDate = new Date(0); // Epoch
    if (timeRange === '30_DAYS') {
        cutoffDate = new Date();
        cutoffDate.setDate(now.getDate() - 30);
    } else if (timeRange === 'YEAR') {
        cutoffDate = new Date(now.getFullYear(), 0, 1);
    }

    const filteredEntries = allEntries.filter(e => new Date(e.date) >= cutoffDate);
    
    // Aggregation Logic (Daily for chart)
    filteredEntries.forEach(entry => {
        const dateStr = entry.date; // YYYY-MM-DD
        if (!dailyData[dateStr]) dailyData[dateStr] = 0;
        dailyData[dateStr] += (entry.completions || 0);
    });

    // Fill missing dates if we want a continuous line? 
    // For simplicity, let's just plot active days. 
    // Better: Sort unique dates.
    const sortedDates = Object.keys(dailyData).sort();

    // Map to nice labels
    const labels = sortedDates.map(d => {
        const dateObj = new Date(d);
        return dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric' });
    });

    const dataPoints = sortedDates.map(d => dailyData[d]);

    return {
      labels,
      datasets: [
        {
          fill: true,
          label: 'Habits Completed',
          data: dataPoints,
          borderColor: '#6366f1', // Indigo-500
          backgroundColor: gradient || 'rgba(99, 102, 241, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#6366f1',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#6366f1',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [habits, timeRange, gradient]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDark ? '#1e293b' : 'rgba(15, 23, 42, 0.9)', 
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: isDark ? '#334155' : 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
            title: (items) => items[0].label,
            label: (item) => `${item.raw} Habits Completed`,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
            color: isDark ? '#334155' : '#f1f5f9', // Slate-700 : Slate-100
            borderDash: [5, 5],
        },
        ticks: { 
            stepSize: 1,
            color: isDark ? '#94a3b8' : '#64748b', // Slate-400 : Slate-500
            font: { size: 11, family: 'Inter, sans-serif' }
        },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: {
            color: isDark ? '#94a3b8' : '#64748b',
            font: { size: 11 },
            maxTicksLimit: 8,
            maxRotation: 0,
        },
        border: { display: false }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    animation: {
        duration: 800,
        easing: 'easeOutQuart'
    }
  }), [isDark]);

  return (
    <div className="d-flex flex-column h-100">
       {/* Header Section */}
       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-graph-up-arrow text-primary fs-5"></i>
                <h5 className="fw-bold text-dark mb-0">Growth Trajectory</h5>
            </div>
            <p className="text-muted small mb-0">Track your consistency over time</p>
          </div>
          
          {/* Time Range Filter */}
          <div className="bg-light p-1 rounded-pill d-inline-flex">
             {['30_DAYS', 'YEAR', 'ALL'].map((range) => (
                <button
                    key={range}
                    className={`btn btn-sm rounded-pill px-3 fw-bold border-0 transition-all ${timeRange === range ? 'bg-white shadow-sm text-primary' : 'text-muted hover-text-dark'}`}
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => setTimeRange(range)}
                >
                    {range === '30_DAYS' ? '30 Days' : range === 'YEAR' ? 'This Year' : 'All Time'}
                </button>
             ))}
          </div>
       </div>

       {/* Quick Stats Row */}
       <div className="row g-3 mb-4">
          <div className="col-4">
             <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-center h-100 border border-primary border-opacity-10">
                 <h3 className="fw-bold text-primary mb-0">{stats.totalCompletions}</h3>
                 <small className="text-primary text-opacity-75 fw-bold" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Total Wins</small>
             </div>
          </div>
          <div className="col-4">
             <div className="p-3 bg-success bg-opacity-10 rounded-4 text-center h-100 border border-success border-opacity-10">
                 <h3 className="fw-bold text-success mb-0">{stats.bestDayCount}</h3>
                 <small className="text-success text-opacity-75 fw-bold" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Best Day</small>
             </div>
          </div>
          <div className="col-4">
             <div className="p-3 bg-info bg-opacity-10 rounded-4 text-center h-100 border border-info border-opacity-10">
                 <h3 className="fw-bold text-info mb-0">{stats.activeHabits}</h3>
                 <small className="text-info text-opacity-75 fw-bold" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Active Habits</small>
             </div>
          </div>
       </div>

       {/* Chart Area */}
       <div className="flex-grow-1 position-relative" style={{ minHeight: '250px' }}>
          <Line 
            ref={chartRef}
            data={chartData} 
            options={options} 
          />
       </div>
    </div>
  );
};

export default ProgressReports;
