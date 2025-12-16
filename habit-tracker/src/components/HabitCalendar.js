import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const HabitCalendar = ({ habit }) => {
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Normalize dates to midnight for comparison
      const checkDate = new Date(date).setHours(0,0,0,0);
      
      const isCompleted = habit.history.some(entry => {
        const entryDate = new Date(entry.date).setHours(0,0,0,0);
        return entryDate === checkDate && entry.completions >= habit.targetCompletions;
      });

      if (isCompleted) {
        return 'calendar-tile-done';
      }
    }
    return '';
  };

  return (
    <div className="custom-calendar-container p-3 bg-white rounded-4 shadow-sm border">
      <div className="d-flex align-items-center justify-content-between mb-3">
         <h6 className="fw-bold text-primary mb-0">
           <i className="bi bi-calendar-check me-2"></i>
           History
         </h6>
         <span className="badge bg-light text-secondary rounded-pill border">
           {new Date().toLocaleString('default', { month: 'long' })}
         </span>
      </div>
      
      <Calendar 
        tileClassName={tileClassName} 
        prevLabel={<i className="bi bi-chevron-left text-muted small"></i>}
        nextLabel={<i className="bi bi-chevron-right text-muted small"></i>}
        next2Label={null}
        prev2Label={null}
        formatShortWeekday={(locale, date) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]}
      />


    </div>
  );
};

export default HabitCalendar;
