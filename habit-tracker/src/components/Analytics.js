import React, { useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import ProgressReports from './ProgressReports';
import StreakHeatmap from './StreakHeatmap';
import Badges from './Badges';

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- Calculation Helper (Pure Function) ---
const calculateHabitSuccessRate = (habit) => {
  if (!habit.history || habit.history.length === 0) return 0;
  
  let totalPossible = 0;
  let actual = 0;
  
  // Consider last 30 days for "Current Success Rate" to be more relevant
  // or just use all history as before. Let's stick to all history for consistency.
  habit.history.forEach(entry => {
    totalPossible += habit.targetCompletions;
    actual += Math.min(entry.completions, habit.targetCompletions);
  });

  return totalPossible === 0 ? 0 : (actual / totalPossible) * 100;
};

const Analytics = ({ habits, categories, earnedBadges = [], theme = 'light' }) => {
  const isDark = theme === 'dark';

  // --- Calculation Helpers ---
  // --- Calculation Helpers ---
  // calculateHabitSuccessRate moved outside component as it is pure

  const calculateCategorySuccessRate = useCallback((categoryName) => {
    // Match by name OR id (assuming categoryName passed here is the Name from the categories array)
    const categoryObj = categories.find(c => c.name === categoryName);
    const categoryId = categoryObj ? categoryObj.id : null;

    const habitsInCategory = habits.filter(habit => {
        return habit.category === categoryName || (categoryId && String(habit.category) === String(categoryId));
    });
    
    if (habitsInCategory.length === 0) return 0;
    const totalRate = habitsInCategory.reduce((sum, h) => sum + calculateHabitSuccessRate(h), 0);
    return totalRate / habitsInCategory.length;
  }, [habits, categories]);

  // --- Chart Data Preparation ---
  
  // 1. Bar Chart: Success Rate per Habit
  const barChartData = useMemo(() => {
    const labels = habits.map(h => h.name);
    const data = habits.map(h => calculateHabitSuccessRate(h));
    
    // Create gradient-like colors or category-based colors
    const bgColors = habits.map(h => {
       // Match by Name OR ID
       const cat = categories.find(c => c.name === h.category || String(c.id) === String(h.category));
       return cat ? cat.color : '#0d6efd';
    });

    return {
      labels,
      datasets: [
        {
          label: 'Success Rate (%)',
          data,
          backgroundColor: bgColors,
          borderRadius: 8,
          barThickness: 20,
        }
      ]
    };
  }, [habits, categories]);

  const barOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
         backgroundColor: isDark ? '#1e293b' : '#fff',
         titleColor: isDark ? '#f8fafc' : '#000',
         bodyColor: isDark ? '#cbd5e1' : '#666',
         borderColor: isDark ? '#334155' : '#eee',
         borderWidth: 1,
         padding: 10,
         callbacks: {
            label: (context) => `${context.raw.toFixed(1)}% Success`
         }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: isDark ? '#334155' : '#f0f0f0' },
        ticks: { 
            font: { size: 10 },
            color: isDark ? '#cbd5e1' : '#666'
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
            font: { size: 10 }, 
            color: isDark ? '#cbd5e1' : '#666',
            maxRotation: 45, 
            minRotation: 0 
        }
      }
    }
  }), [isDark]);

  // 2. Pie Chart: Category Success Comparison
  const pieChartData = useMemo(() => {
     // Filter out categories with no habits for cleaner chart
     const activeCategories = categories.filter(c => {
         return habits.some(h => h.category === c.name || String(h.category) === String(c.id));
     });
     
     const labels = activeCategories.map(c => c.name);
     const data = activeCategories.map(c => calculateCategorySuccessRate(c.name));
     const bgColors = activeCategories.map(c => c.color || '#ccc');

     return {
       labels,
       datasets: [
         {
           data,
           backgroundColor: bgColors,
           borderWidth: 2,
           borderColor: isDark ? '#1e293b' : '#fff', // Match card background
         }
       ]
     };
  }, [habits, categories, isDark, calculateCategorySuccessRate]);

  const pieOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
       legend: { 
         position: 'bottom', 
         labels: { 
           usePointStyle: true, 
           boxWidth: 8,
           font: { size: 11 },
           color: isDark ? '#cbd5e1' : '#666'
         } 
       },
       tooltip: {
         backgroundColor: isDark ? '#1e293b' : '#fff',
         titleColor: isDark ? '#f8fafc' : '#000',
         bodyColor: isDark ? '#cbd5e1' : '#666',
         borderColor: isDark ? '#334155' : '#eee',
         borderWidth: 1,
         callbacks: {
            label: function(context) {
                let label = context.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed !== null) {
                    // Assuming data is success rate percentage
                    label += context.parsed.toFixed(1) + '% Success';
                }
                return label;
            }
         }
       }
    }
  }), [isDark]);


  return (
    <div className="analytics-container fade-in">
       <div className="d-flex align-items-center mb-4">
          <h3 className="fw-bold mb-0 text-dark">Your Insights</h3>
          <span className="ms-3 badge bg-light text-secondary rounded-pill border">
            {habits.length} Active Habits
          </span>
       </div>

       {/* Charts Row */}
       <div className="row g-4 mb-4">
          {/* Success Rates Bar Chart */}
          <div className="col-lg-8">
             <div className="modern-card p-4 rounded-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                   <h5 className="fw-bold text-dark mb-0">Habit Performance</h5>
                   <i className="bi bi-bar-chart-fill text-primary opacity-50 fs-5"></i>
                </div>
                <div style={{ height: '300px' }}>
                   {habits.length > 0 ? (
                      <Bar data={barChartData} options={barOptions} />
                   ) : (
                      <div className="h-100 d-flex align-items-center justify-content-center text-muted small">
                         No data available
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* Category Distribution / Success */}
          <div className="col-lg-4">
             <div className="modern-card p-4 rounded-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                   <h5 className="fw-bold text-dark mb-0">Category Strength</h5>
                   <i className="bi bi-pie-chart-fill text-success opacity-50 fs-5"></i>
                </div>
                <div style={{ height: '250px', position: 'relative' }}>
                   {habits.length > 0 ? (
                     <Pie data={pieChartData} options={pieOptions} />
                   ) : (
                      <div className="h-100 d-flex align-items-center justify-content-center text-muted small">
                         No data available
                      </div>
                   )}
                   
                   {/* Centered Score (Average) if wanted, or just clean */}
                </div>
                <p className="text-center text-muted small mt-3 mb-0">
                   Success rates aggregated by category.
                </p>
             </div>
          </div>
       </div>

       {/* Heatmap Row */}
       <div className="row mb-4">
          <div className="col-12">
             <div className="modern-card p-4 rounded-4">
                <StreakHeatmap habits={habits} categories={categories} />
             </div>
          </div>
       </div>

       {/* Progress & Badges Row */}
       <div className="row g-4">
          <div className="col-lg-8">
             <ProgressReports habits={habits} theme={theme} />
          </div>
          <div className="col-lg-4">
             <div className="modern-card p-4 rounded-4 h-100 bg-light-subtle">
                <div className="d-flex align-items-center mb-3">
                   <h5 className="fw-bold text-dark mb-0">Trophy Case</h5>
                   <i className="bi bi-award-fill text-warning ms-2"></i>
                </div>
                <Badges earnedBadges={earnedBadges} />
             </div>
          </div>
       </div>
    </div>
  );
};

export default Analytics;
